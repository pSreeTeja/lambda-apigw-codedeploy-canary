# 📘 Canary Deployment of Lambda with API Gateway (AWS CDK, TypeScript)

## 🎯 Goal

Implement safe canary deployments for a Lambda function behind API Gateway using AWS CDK (TypeScript).

- Each new deployment sends a small percentage (e.g., 10%) of traffic to the new Lambda version.
- If the new version works fine, traffic automatically shifts to 100% new version after a defined interval.
- If errors occur, traffic rolls back automatically to the stable version using CloudWatch alarms.

---

## ⚙️ Key AWS Components Involved

- **Lambda Function** – Business logic.
- **Lambda Versions & Aliases** – Enable routing between old & new versions.
- **API Gateway** – Exposes Lambda alias as an HTTP endpoint.
- **CodeDeploy** – Handles traffic shifting (canary/linear) during deployment.
- **CloudWatch Alarms** – Monitor errors/latency and trigger rollback.
- **CDK (TypeScript)** – Infrastructure as code.

---

## 🏗️ Implementation Steps

### 1. Lambda Setup

- Define the Lambda function in CDK.
- Use `handler.currentVersion` to create an immutable version.
- Attach a `prod` alias pointing to the current version.

### 2. API Gateway Setup

- Create an API Gateway (`LambdaRestApi`).
- Point it to the Lambda alias (not `$LATEST`).

### 3. Canary Deployment with CodeDeploy

- Create a `LambdaDeploymentGroup` in CDK.
- Attach it to the Lambda `prod` alias.
- Choose a deployment strategy (e.g., `CANARY_10PERCENT_5MINUTES`):
  - 10% traffic → new version for 5 minutes.
  - If no errors → auto-shift to 100%.

### 4. CloudWatch Alarm for Rollback

- Create a `cloudwatch.Alarm` on `alias.metricErrors()`.
- Add it to the deployment group.
- If the alarm triggers → CodeDeploy rolls back automatically.

---
