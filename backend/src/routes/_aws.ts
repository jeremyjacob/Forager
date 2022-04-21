// Load the AWS SDK for Node.js
import AWS from 'aws-sdk';
import { promisify } from 'util';
// Load credentials and set region from JSON file
AWS.config.loadFromPath('../aws-config.json');
const ecs = new AWS.ECS();
const cloudWatch = new AWS.CloudWatch();

export function main() {
	// ecs.describeServices({ cluster: 'default', services: ['sample-app-service'] }, (e, x) =>
	// 	console.log(x.services[0].deployments) // desired, pending, running
	// );
	// ecs.updateService({ service: 'sample-app-service', desiredCount: 2 }, console.log);
	// ecs.describeTaskSets({ cluster: 'default', service: 'sample-app-service' }, console.log);
	// ecs.describeTasks({ tasks: ['731507ebeea24d439eae3b530d90df02'] }, console.log);
	// cloudWatch.getMetricData({},console.log);
}

// // AMI is amzn-ami-2011.09.1.x86_64-ebs
// const instanceParams = {
// 	ImageId: 'AMI_ID',
// 	InstanceType: 't2.micro',
// 	KeyName: 'KEY_PAIR_NAME',
// 	MinCount: 1,
// 	MaxCount: 1
// };

// // Create a promise on an EC2 service object
// const instancePromise = ec2.runInstances(instanceParams).promise();

// // Handle promise's fulfilled/rejected states
// instancePromise
// 	.then(function (data) {
// 		console.log(data);
// 		var instanceId = data.Instances[0].InstanceId;
// 		console.log('Created instance', instanceId);
// 		// Add tags to the instance
// 		const tagParams = {
// 			Resources: [instanceId],
// 			Tags: [
// 				{
// 					Key: 'Name',
// 					Value: 'SDK Sample'
// 				}
// 			]
// 		};
// 		// Create a promise on an EC2 service object
// 		var tagPromise = ec2.createTags(tagParams).promise();
// 		// Handle promise's fulfilled/rejected states
// 		tagPromise
// 			.then(function (data) {
// 				console.log('Instance tagged');
// 			})
// 			.catch(function (err) {
// 				console.error(err, err.stack);
// 			});
// 	})
// 	.catch(function (err) {
// 		console.error(err, err.stack);
// 	});
