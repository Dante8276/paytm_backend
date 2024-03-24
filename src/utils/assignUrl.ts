import { Runner } from '../models/runner';
import { RunnerUrl } from '../models/runnerUrl';
import { Url } from '../models/url';

export const assignUrlToRunner = async (runnerId: string, runnerIp: string): Promise<string | null> => {
  const existingRunnerUrl = await RunnerUrl.findOne({ runner_id: runnerId });
  if (existingRunnerUrl) {
    const url = await Url.findById(existingRunnerUrl.url_id);
    if (url) {
      return url.url;
    }
  }

  const urlCounts = await RunnerUrl.aggregate([
    { $group: { _id: '$url_id', count: { $sum: 1 } } },
  ]);

  const availableUrls = await Url.find({
    _id: { $nin: urlCounts.map((urlCount) => urlCount._id) },
  }).sort({ priority: -1 });

  if (availableUrls.length === 0) {
    const leastUsedUrl = await Url.findOne({
      _id: { $in: urlCounts.map((urlCount) => urlCount._id) },
    }).sort({ priority: -1, 'urlCounts.count': 1 });

    if (!leastUsedUrl) {
      return null;
    }

    const newRunnerUrl = new RunnerUrl({
      runner_id: runnerId,
      url_id: leastUsedUrl._id,
      ip: runnerIp, // Add the IP field here
    });
    await newRunnerUrl.save();

    return leastUsedUrl.url;
  }

  const newRunnerUrl = new RunnerUrl({
    runner_id: runnerId,
    url_id: availableUrls[0]._id,
    ip: runnerIp, // Add the IP field here
  });
  await newRunnerUrl.save();

  return availableUrls[0].url;
};