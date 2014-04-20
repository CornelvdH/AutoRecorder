/**
 * The HTTP Options array tells the request what server to reach and what page to request.
 */
var httpOptions = {
    host: 'rtvlansingerland.nl',
    port: 80,
    path: '/streams/rtvll.php'
};

/**
 * The data we pass on to the recorder for each recording. 
 * We may get these values from an external request later.
 */
var recordData = [
    "2014-04-18 Test 1",
    "Test 123",
    "Bla bla bla"
];

/**
 * The trigger text we use to determine if we need to start a recording.
 * We may get this value from external sources.
 */
var triggerWord = "Lansinger Magazine - Start Recording";

/**
 * We need the HTTP Library for this to work.
 */
var http = require('http');

/**
 * The current text variable holds the value currently on the track feed.
 */
var currentText = "<empty>";

/**
 * This variable holds the value previously presented on the track feed.
 */
var prevText = "";

/**
 * The stringified time on which the recording started.
 */
var startTimeStamp = "";

/**
 * The stringified time on which the recording stopped.
 */
var stopTimeStamp = "";

/**
 * Determines whether we have a recording running at the moment.
 */
var recRunning = false;

/**
 * Each time the application runs into the trigger word, a recording starts. 
 * When the recording finishes, this number is incremented.
 */
var recNum = 0;

/**
 * The interval on which we poll our main function. 
 * 1000 is the best number for production uses, while 2000 may be more appropriate for testing.
 */
var intervalTime = 1000;

/**
 * Create a process caller so we can execute our AutoIt script.
 */
var exec = require('child_process').exec,
        child;

/**
 * We put our interval function in a var, so we can pull the plug more easily.
 */
var tid = setInterval(function() {
    /**
     * When using http.get, we use the HTTP Options array we defined earlier. 
     * This way we get consistent requests.
     */
    http.get(httpOptions, function(res) {
        /**
         * We define our temporary body var to store our result in.
         * This is actually just a simple string builder.
         */
        var body = '';
        /**
         * When we get our data back, we put all buffered chunks into the body var.
         */
        res.on('data', function(chunk) {
            body += chunk;
        });
        /**
         * The server eventually signals its end of stream. This means we should have gathered all data.
         * We can proceed with our main application.
         */
        res.on('end', function() {
            /**
             * The PC-Radio plugin is lousy when defining its name endings. 
             * This means 99% of the time we have trailing whitespaces we don't like.
             */
            var trimmedBody = body.trim();
            /**
             * Only do things when the track feed differs. 
             * If it doesn't differ, there's no use in executing further actions.
             */
            if (currentText !== trimmedBody) {
                /**
                 * Put our old track feed into the previous text variable, so we have it in place for logging purposes.
                 * Then put our current feed into its designated variable.
                 */
                prevText = currentText;
                currentText = trimmedBody;
                /**
                 * We need the current time, although this stringified way may not be the best solution to use it.
                 */
                var date = new Date().toTimeString();
                /**
                 * Check if the track feed matches our magic trigger words. 
                 * If so, we start a recording. If not, we just clean up after ourselves.
                 * 
                 * We cannot run two recordings at one time, so if there's already a recording happening, we just abort.
                 */
                if (trimmedBody === triggerWord && !recRunning) {
                    console.log(date + ": Recording started.");
                    /**
                     * Update start time to current value.
                     */
                    startTimeStamp = date;
                    /**
                     * Put our recording's boolean to true, so the application knows something's running.
                     */
                    recRunning = true;
                    /**
                     * Get the child process to execute our start command. 
                     */
                    child = exec('RecStart.exe',
                            function(error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                            });

                } else {
                    /**
                     * If we get here, two things may have happened:
                     * 1. The current track feed doesn't match the trigger word.
                     * 2. We have a recording already running.
                     * 
                     * We first check if the track feed is empty, 
                     * which happens all the time (unwanted track listing, microphone talk, etc.)
                     * If it's not empty, we just go on with business.
                     */
                    if (trimmedBody.length > 0) {
                        /**
                         * Check if a recording is running. 
                         * If so, we stop it because a new track started.
                         */
                        if (recRunning) {
                            /**
                             * Stop our recording globally.
                             */
                            recRunning = false;
                            /**
                             * Put our stopping time in our var for user notifications etc.
                             */
                            stopTimeStamp = date;
                            /**
                             * Get the child process to execute our stop command. 
                             * We provide the name data to this process since he's the one who does the saving.
                             */
                            child = exec('RecStop.exe "' + recordData[recNum] + '"',
                                    function(error, stdout, stderr) {
                                        console.log('stdout: ' + stdout);
                                        console.log('stderr: ' + stderr);
                                        if (error !== null) {
                                            console.log('exec error: ' + error);
                                        }
                                    });

                            /**
                             * Tell the user it happened.
                             */
                            console.log(date + ": Recording stopped. Name: " + recordData[recNum]);
                            /**
                             * Here we should put our recording command, i.e. sending a terminal command to the server.
                             * 
                             * We increment our recNum, so the next recording may have different metadata in it.
                             */
                            recNum++;
                        } else {
                            /**
                             * We're just dealing with a common track change. 
                             * Just tell the user and get off.
                             */
                            console.log(date + ": Track Change. From " + prevText + " to " + currentText);
                        }
                    } else {
                        /**
                         * Empty track stamps may be unwanted behavior. Tell the user about this.
                         */
                        console.log(date + ": Empty track stamp detected.");
                    }
                }
            }
        });
    });
}, intervalTime);