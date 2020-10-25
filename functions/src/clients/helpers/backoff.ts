import * as backoff from 'backoff';
import { logger } from 'firebase-functions';

/**
 * Tries executing the 'operation' in a fail-resistant way.
 * The operation will be tried at most 'maxRetries' times before failing.
 * The amount of time between retries increases exponentially but never surpasses 'maxDelay'.
 * The first try will happen after a random delay, but no later than 'maxInitialDelay'
 */
export default (
  operation: () => Promise<void>,
  operationName: string,
  maxDelay = 60,
  maxRetries = 5,
  maxInitialDelay = 10
) => {
  return new Promise<void>((resolve, reject) => {
    const _backoff = backoff.exponential({
      // Max. time to wait between retries
      maxDelay: maxDelay * 1000,

      // Start the first try after a random delay
      initialDelay: Math.random() * maxInitialDelay * 1000,
    });

    // How many retries are allowed
    _backoff.failAfter(maxRetries);

    // If all retries fail, reject the promise
    _backoff.on('fail', () => {
      logger.error(`Operation ${operationName} failed ${maxRetries} times. No more retries.`);
      reject();
    });

    // On each try...
    _backoff.on('ready', (attempt, delay) => {
      // ... log the attempt number and how much it was delayed
      logger.info(`${operationName} attempt nr ${attempt + 1} after ${delay} ms.`);

      // ... try executing the operation
      operation().then(resolve, (error) => {
        logger.warn(error);
        _backoff.backoff();
      });
    });
    _backoff.backoff();
  });
};
