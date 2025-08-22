# 📘 Canary Deployment of Lambda with API Gateway (AWS CDK, TypeScript)

## 🎯 Goal

Implement safe canary deployments for a Lambda function behind API Gateway using AWS CDK (TypeScript).

### Objectives:

- Gradually shift traffic to a new Lambda version using canary deployment strategies.
- Automatically roll back to the stable version if errors or latency issues are detected.
- Leverage AWS services like CodeDeploy and CloudWatch for seamless traffic management and monitoring.

---

## ⚙️ Key AWS Components

- **Lambda Function**: Core business logic.
- **Lambda Versions & Aliases**: Manage traffic routing between versions.
- **API Gateway**: Exposes the Lambda alias as an HTTP endpoint.
- **CodeDeploy**: Automates traffic shifting and rollback during deployments.
- **CloudWatch Alarms**: Tracks errors/latency to trigger rollbacks.
- **CDK (TypeScript)**: Infrastructure as code for defining resources.

---

## 🏗️ Implementation Steps

### 1. Lambda Setup

- Define the Lambda function in CDK.
- Create an immutable version using `handler.currentVersion`.
- Assign a `prod` alias to the current version.

### 2. API Gateway Setup

- Use `LambdaRestApi` to create an API Gateway.
- Link it to the Lambda alias instead of `$LATEST`.

### 3. Canary Deployment with CodeDeploy

- Define a `LambdaDeploymentGroup` in CDK.
- Attach it to the Lambda `prod` alias.
- Select a deployment strategy like `CANARY_10PERCENT_5MINUTES`:
  - Route 10% of traffic to the new version for 5 minutes.
  - If no issues arise, shift 100% of traffic to the new version.

### 4. CloudWatch Alarm for Rollback

- Set up a `cloudwatch.Alarm` on `alias.metricErrors()`.
- Add the alarm to the deployment group.
- Trigger automatic rollback if the alarm is activated.

---

## ✅ Benefits of This Setup

- Zero-downtime deployments.
- Safe validation of new code in production.
- Automatic rollback on failures.
- Fully managed by AWS CodeDeploy and CloudWatch.
- Declaratively defined using CDK (TypeScript).

---

## 🔮 Next Enhancements

- Add latency-based CloudWatch alarms to monitor response times.
- Integrate with CI/CD pipelines like CodePipeline or GitHub Actions.
- Customize deployment configurations for finer traffic control.
