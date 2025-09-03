By completing this task, you will be able to:
- **Deploy containerized applications to AWS ECS**: Gain hands-on experience deploying multi-service Flask applications to a production-ready container orchestration platform.
- **Configure AWS infrastructure**: Set up and work with AWS services, including ECS, ECR, ALB, and EC2 instances, in a hands-on lab environment.
- **Implement container registry workflows**: Push Docker images to Amazon ECR and configure ECS to pull images from the registry.
- **Understand microservices deployment patterns**: Deploy the complete inventory management system with gateway and API services as separate containers.

## Implementation requirements

Deploy your complete full-stack application (backend + frontend) to AWS using Elastic Container Service (ECS).
You will work in an AWS lab environment with pre-configured infrastructure, including VPC, subnets, and an ECS cluster.

### Provided AWS lab environment

You will work in a pre-configured AWS environment that includes:
- **Amazon ECS cluster**: Ready for container deployment with EC2 instances.
- **Application Load Balancer (ALB)**: Pre-configured with target groups for each service.
- **Amazon ECR repositories**: For storing Docker images.
- **VPC with public subnets**: Network infrastructure across multiple availability zones.
- **Cloud9 development environment**: Command-line access for building and deploying containers.

### Deployment tasks

1. **Build and test Docker images locally**: Verify that containers work as expected before pushing to AWS, as you did in the previous task.
2. **Push images to Amazon ECR**: Upload container images to the registry.
3. **Create ECS task definitions**: Define how containers should run in ECS.
4. **Deploy ECS services**: Launch and configure auto-scaling container services.
5. **Configure load balancing**: Set up traffic routing through the Application Load Balancer.
6. **Test the deployed application**: Verify that all endpoints work in the cloud environment.

### Success criteria

- **Inventory API functional**: All backend routes work correctly.
- **Gateway service accessible**: HTTP requests successfully reach the frontend through the ALB.
- **Service communication**: The frontend forwards requests to the backend seamlessly.
- **Container health**: ECS reports all tasks as healthy and running.
- **Load balancing**: Multiple container instances distribute traffic properly.

<div class="hint" title="Container Communication">

**Important**: In the AWS ECS environment, services communicate using the ALB DNS name instead of Docker Compose service names. You'll need to update any hardcoded service references in your application code to use the load balancer endpoints.

</div>

<div class="hint" title="Lab Environment Access">

**Lab Setup**: Access the AWS lab environment through the following [link](staging.academy.labs.jb.gg/lti/platform/resource/launch/platfromresource1/load). The lab includes a Cloud9 environment where you can run Docker commands and interact with AWS CLI. All necessary permissions and infrastructure are pre-configured.

</div>

### AWS services used

- **Amazon ECS**: Container orchestration and service management.
- **Amazon ECR**: Docker container registry for image storage.
- **Application Load Balancer**: Traffic distribution and health checks.
- **Amazon EC2**: Underlying compute instances for container hosting.
- **Amazon VPC**: Network isolation and security groups.
