import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as codedeploy from "aws-cdk-lib/aws-codedeploy";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

export class LambdaApigwCodedeployCanaryStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Lambda function
    const handler = new lambda.Function(this, "MyLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lambda"), // your code folder
      handler: "index.handler",
    });

    // Version + Alias (Stable = prod)
    const version = handler.currentVersion;
    const alias = new lambda.Alias(this, "LambdaProdAlias", {
      aliasName: "prod",
      version,
    });

    // API Gateway REST API using alias
    const api = new apigateway.LambdaRestApi(this, "MyApi", {
      handler: alias,
      proxy: true,
    });

    const errorAlarm = new cloudwatch.Alarm(this, "LambdaErrorAlarm", {
      metric: alias.metricErrors({
        period: cdk.Duration.minutes(1),
        statistic: "Sum",
      }),
      threshold: 1,
      evaluationPeriods: 1,
      alarmDescription: "Alarm if lambda errors > 0 during canary deployment",
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // ✅ CodeDeploy Canary Deployment for Lambda
    new codedeploy.LambdaDeploymentGroup(this, "DeploymentGroup", {
      alias,
      deploymentConfig: codedeploy.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
      alarms: [errorAlarm],
      // Other options: LINEAR_10PERCENT_EVERY_1MINUTE, ALL_AT_ONCE, etc.
      autoRollback: {
        failedDeployment: true,   // rollback if errors
        deploymentInAlarm: true, // rollback if alarm is triggered
      },
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
    });
  }
}
