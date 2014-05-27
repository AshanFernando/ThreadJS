(function (window, Worker, Blob, URL) {
    'use strict';
    window.Thread = function (config) {

        var self = this, jobCode, virtualScriptForWorker, blobURL, blobInstance, workerInstance, finishPromise, failPromise, result, error;

        var createBlob = function (response) {
            var blob, BlobBuilder;
            try {
                blob = new Blob([response], { type: 'text/javascript' });
            } catch (e) { /* Backwards-compatibility */
                BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                blob = new BlobBuilder();
                blob.append(response);
                blob = blob.getBlob();
            }
            return blob;
        };

        var createWorker = function (url, job) {
            var worker, virtualWorker = function (job) {
                return {
                    postMessage: function (data) {
                        try{
                            result = job(data);
                            if (config && config.job) { /* If job is passed as callback */
                                this.onmessage({ data: result });
                            }
                        } catch (e) {
                            error = e;
                            if (config && config.fail) { /* If fail is passed as callback */
                                this.onerror(error);
                            }
                        }
                    }
                };
            };
            try {
                worker = !Worker ? virtualWorker(job) : new Worker(url);
            } catch (e) {     /* If Worker is not supported by the browser or causes issues, fallback to 'Single Thread' mode */
                worker = virtualWorker(job);
            }
            return worker;
        };

        this.finish = function (callback) {
            if (result) { /* If job is passed as a promise */
                callback.bind(this)(result);
            }
            finishPromise = callback;
            return this;
        };
        this.fail = function (callback) {
            if (error) { /* If job is passed as a promise */
                callback.bind(this)(error);
            }
            failPromise = callback;
            return this;
        };

        this.start = function (data, job) {
            /* Initialize data */
            job = job || config.job;
            jobCode = job.toString();
            virtualScriptForWorker = 'onmessage = function (msg) { var job = ' + jobCode + '; var result = job(msg.data); this.postMessage(result); };';
            blobInstance = createBlob(virtualScriptForWorker);
            blobURL = URL.createObjectURL(blobInstance);
            workerInstance = createWorker(blobURL, job);

            workerInstance.onmessage = function (msg) {
                /* After executing the job, fire 'finish' event */
                var finish = config && config.finish ? config.finish.bind(self) : finishPromise ? finishPromise.bind(self) : undefined;
                if (typeof finish === 'function') {
                    finish(msg.data, self.getId());
                }
            };

            workerInstance.onerror = function (msg) {
                /* If error occurs while executing code call 'fail' event */
                var fail = config && config.fail ? config.fail.bind(self) : failPromise ? failPromise.bind(self) : undefined;
                if (typeof fail === 'function') {
                    fail(msg);
                }
            };

            /* Start worker */
            workerInstance.postMessage(data || config.data);
            return this;
        };

        this.close = function () {
            if (workerInstance.terminate) {
                workerInstance.terminate();
            }
            if (blobURL) { /* Release the blob URL when closing Worker */
                URL.revokeObjectURL(blobURL);
            }
            /* Release blob resources explicitely in IE */
            if (blobInstance.msClose) {
                blobInstance.msClose();
            }
        };

        this.reStart = function (data) {
            /* Re-execute job with new parameters */
            if (result) {
                result = null;
            }
            if (error) {
                error = null;
            }
            workerInstance.postMessage(data);
            return this;
        };

        this.getId = function () {
            /* Return unique identifier of the Thread */
            return blobURL.split('/')[1];
        };
    };
}(window, window.Worker, Blob, window.URL || window.webkitURL));