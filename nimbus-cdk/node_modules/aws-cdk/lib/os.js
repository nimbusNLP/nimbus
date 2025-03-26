"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shell = shell;
const child_process = require("child_process");
const chalk = require("chalk");
const logging_1 = require("./logging");
const error_1 = require("./toolkit/error");
/**
 * OS helpers
 *
 * Shell function which both prints to stdout and collects the output into a
 * string.
 */
async function shell(command) {
    const commandLine = renderCommandLine(command);
    (0, logging_1.debug)(`Executing ${chalk.blue(commandLine)}`);
    const child = child_process.spawn(command[0], renderArguments(command.slice(1)), {
        // Need this for Windows where we want .cmd and .bat to be found as well.
        shell: true,
        stdio: ['ignore', 'pipe', 'inherit'],
    });
    return new Promise((resolve, reject) => {
        const stdout = new Array();
        // Both write to stdout and collect
        child.stdout.on('data', chunk => {
            process.stdout.write(chunk);
            stdout.push(chunk);
        });
        child.once('error', reject);
        child.once('exit', code => {
            if (code === 0) {
                resolve(Buffer.from(stdout).toString('utf-8'));
            }
            else {
                reject(new error_1.ToolkitError(`${commandLine} exited with error code ${code}`));
            }
        });
    });
}
function renderCommandLine(cmd) {
    return renderArguments(cmd).join(' ');
}
/**
 * Render the arguments to include escape characters for each platform.
 */
function renderArguments(cmd) {
    if (process.platform !== 'win32') {
        return doRender(cmd, hasAnyChars(' ', '\\', '!', '"', "'", '&', '$'), posixEscape);
    }
    else {
        return doRender(cmd, hasAnyChars(' ', '"', '&', '^', '%'), windowsEscape);
    }
}
/**
 * Render a UNIX command line
 */
function doRender(cmd, needsEscaping, doEscape) {
    return cmd.map(x => needsEscaping(x) ? doEscape(x) : x);
}
/**
 * Return a predicate that checks if a string has any of the indicated chars in it
 */
function hasAnyChars(...chars) {
    return (str) => {
        return chars.some(c => str.indexOf(c) !== -1);
    };
}
/**
 * Escape a shell argument for POSIX shells
 *
 * Wrapping in single quotes and escaping single quotes inside will do it for us.
 */
function posixEscape(x) {
    // Turn ' -> '"'"'
    x = x.replace(/'/g, "'\"'\"'");
    return `'${x}'`;
}
/**
 * Escape a shell argument for cmd.exe
 *
 * This is how to do it right, but I'm not following everything:
 *
 * https://blogs.msdn.microsoft.com/twistylittlepassagesallalike/2011/04/23/everyone-quotes-command-line-arguments-the-wrong-way/
 */
function windowsEscape(x) {
    // First surround by double quotes, ignore the part about backslashes
    x = `"${x}"`;
    // Now escape all special characters
    const shellMeta = new Set(['"', '&', '^', '%']);
    return x.split('').map(c => shellMeta.has(x) ? '^' + c : c).join('');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBLHNCQTRCQztBQXZDRCwrQ0FBK0M7QUFDL0MsK0JBQStCO0FBQy9CLHVDQUFrQztBQUNsQywyQ0FBK0M7QUFFL0M7Ozs7O0dBS0c7QUFDSSxLQUFLLFVBQVUsS0FBSyxDQUFDLE9BQWlCO0lBQzNDLE1BQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLElBQUEsZUFBSyxFQUFDLGFBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUMsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMvRSx5RUFBeUU7UUFDekUsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQztLQUNyQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksT0FBTyxDQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxFQUFPLENBQUM7UUFFaEMsbUNBQW1DO1FBQ25DLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUM5QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDeEIsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxJQUFJLG9CQUFZLENBQUMsR0FBRyxXQUFXLDJCQUEyQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUUsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxHQUFhO0lBQ3RDLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxHQUFhO0lBQ3BDLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUUsQ0FBQztRQUNqQyxPQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7U0FBTSxDQUFDO1FBQ04sT0FBTyxRQUFRLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUUsQ0FBQztBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsUUFBUSxDQUFDLEdBQWEsRUFBRSxhQUFxQyxFQUFFLFFBQStCO0lBQ3JHLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxHQUFHLEtBQWU7SUFDckMsT0FBTyxDQUFDLEdBQVcsRUFBRSxFQUFFO1FBQ3JCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsV0FBVyxDQUFDLENBQVM7SUFDNUIsa0JBQWtCO0lBQ2xCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQVMsYUFBYSxDQUFDLENBQVM7SUFDOUIscUVBQXFFO0lBQ3JFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2Isb0NBQW9DO0lBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IHsgZGVidWcgfSBmcm9tICcuL2xvZ2dpbmcnO1xuaW1wb3J0IHsgVG9vbGtpdEVycm9yIH0gZnJvbSAnLi90b29sa2l0L2Vycm9yJztcblxuLyoqXG4gKiBPUyBoZWxwZXJzXG4gKlxuICogU2hlbGwgZnVuY3Rpb24gd2hpY2ggYm90aCBwcmludHMgdG8gc3Rkb3V0IGFuZCBjb2xsZWN0cyB0aGUgb3V0cHV0IGludG8gYVxuICogc3RyaW5nLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hlbGwoY29tbWFuZDogc3RyaW5nW10pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBjb21tYW5kTGluZSA9IHJlbmRlckNvbW1hbmRMaW5lKGNvbW1hbmQpO1xuICBkZWJ1ZyhgRXhlY3V0aW5nICR7Y2hhbGsuYmx1ZShjb21tYW5kTGluZSl9YCk7XG4gIGNvbnN0IGNoaWxkID0gY2hpbGRfcHJvY2Vzcy5zcGF3bihjb21tYW5kWzBdLCByZW5kZXJBcmd1bWVudHMoY29tbWFuZC5zbGljZSgxKSksIHtcbiAgICAvLyBOZWVkIHRoaXMgZm9yIFdpbmRvd3Mgd2hlcmUgd2Ugd2FudCAuY21kIGFuZCAuYmF0IHRvIGJlIGZvdW5kIGFzIHdlbGwuXG4gICAgc2hlbGw6IHRydWUsXG4gICAgc3RkaW86IFsnaWdub3JlJywgJ3BpcGUnLCAnaW5oZXJpdCddLFxuICB9KTtcblxuICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgc3Rkb3V0ID0gbmV3IEFycmF5PGFueT4oKTtcblxuICAgIC8vIEJvdGggd3JpdGUgdG8gc3Rkb3V0IGFuZCBjb2xsZWN0XG4gICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgY2h1bmsgPT4ge1xuICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2h1bmspO1xuICAgICAgc3Rkb3V0LnB1c2goY2h1bmspO1xuICAgIH0pO1xuXG4gICAgY2hpbGQub25jZSgnZXJyb3InLCByZWplY3QpO1xuXG4gICAgY2hpbGQub25jZSgnZXhpdCcsIGNvZGUgPT4ge1xuICAgICAgaWYgKGNvZGUgPT09IDApIHtcbiAgICAgICAgcmVzb2x2ZShCdWZmZXIuZnJvbShzdGRvdXQpLnRvU3RyaW5nKCd1dGYtOCcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChuZXcgVG9vbGtpdEVycm9yKGAke2NvbW1hbmRMaW5lfSBleGl0ZWQgd2l0aCBlcnJvciBjb2RlICR7Y29kZX1gKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJDb21tYW5kTGluZShjbWQ6IHN0cmluZ1tdKSB7XG4gIHJldHVybiByZW5kZXJBcmd1bWVudHMoY21kKS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBhcmd1bWVudHMgdG8gaW5jbHVkZSBlc2NhcGUgY2hhcmFjdGVycyBmb3IgZWFjaCBwbGF0Zm9ybS5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyQXJndW1lbnRzKGNtZDogc3RyaW5nW10pIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcbiAgICByZXR1cm4gZG9SZW5kZXIoY21kLCBoYXNBbnlDaGFycygnICcsICdcXFxcJywgJyEnLCAnXCInLCBcIidcIiwgJyYnLCAnJCcpLCBwb3NpeEVzY2FwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRvUmVuZGVyKGNtZCwgaGFzQW55Q2hhcnMoJyAnLCAnXCInLCAnJicsICdeJywgJyUnKSwgd2luZG93c0VzY2FwZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW5kZXIgYSBVTklYIGNvbW1hbmQgbGluZVxuICovXG5mdW5jdGlvbiBkb1JlbmRlcihjbWQ6IHN0cmluZ1tdLCBuZWVkc0VzY2FwaW5nOiAoeDogc3RyaW5nKSA9PiBib29sZWFuLCBkb0VzY2FwZTogKHg6IHN0cmluZykgPT4gc3RyaW5nKTogc3RyaW5nW10ge1xuICByZXR1cm4gY21kLm1hcCh4ID0+IG5lZWRzRXNjYXBpbmcoeCkgPyBkb0VzY2FwZSh4KSA6IHgpO1xufVxuXG4vKipcbiAqIFJldHVybiBhIHByZWRpY2F0ZSB0aGF0IGNoZWNrcyBpZiBhIHN0cmluZyBoYXMgYW55IG9mIHRoZSBpbmRpY2F0ZWQgY2hhcnMgaW4gaXRcbiAqL1xuZnVuY3Rpb24gaGFzQW55Q2hhcnMoLi4uY2hhcnM6IHN0cmluZ1tdKTogKHg6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gIHJldHVybiAoc3RyOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gY2hhcnMuc29tZShjID0+IHN0ci5pbmRleE9mKGMpICE9PSAtMSk7XG4gIH07XG59XG5cbi8qKlxuICogRXNjYXBlIGEgc2hlbGwgYXJndW1lbnQgZm9yIFBPU0lYIHNoZWxsc1xuICpcbiAqIFdyYXBwaW5nIGluIHNpbmdsZSBxdW90ZXMgYW5kIGVzY2FwaW5nIHNpbmdsZSBxdW90ZXMgaW5zaWRlIHdpbGwgZG8gaXQgZm9yIHVzLlxuICovXG5mdW5jdGlvbiBwb3NpeEVzY2FwZSh4OiBzdHJpbmcpIHtcbiAgLy8gVHVybiAnIC0+ICdcIidcIidcbiAgeCA9IHgucmVwbGFjZSgvJy9nLCBcIidcXFwiJ1xcXCInXCIpO1xuICByZXR1cm4gYCcke3h9J2A7XG59XG5cbi8qKlxuICogRXNjYXBlIGEgc2hlbGwgYXJndW1lbnQgZm9yIGNtZC5leGVcbiAqXG4gKiBUaGlzIGlzIGhvdyB0byBkbyBpdCByaWdodCwgYnV0IEknbSBub3QgZm9sbG93aW5nIGV2ZXJ5dGhpbmc6XG4gKlxuICogaHR0cHM6Ly9ibG9ncy5tc2RuLm1pY3Jvc29mdC5jb20vdHdpc3R5bGl0dGxlcGFzc2FnZXNhbGxhbGlrZS8yMDExLzA0LzIzL2V2ZXJ5b25lLXF1b3Rlcy1jb21tYW5kLWxpbmUtYXJndW1lbnRzLXRoZS13cm9uZy13YXkvXG4gKi9cbmZ1bmN0aW9uIHdpbmRvd3NFc2NhcGUoeDogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gRmlyc3Qgc3Vycm91bmQgYnkgZG91YmxlIHF1b3RlcywgaWdub3JlIHRoZSBwYXJ0IGFib3V0IGJhY2tzbGFzaGVzXG4gIHggPSBgXCIke3h9XCJgO1xuICAvLyBOb3cgZXNjYXBlIGFsbCBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgY29uc3Qgc2hlbGxNZXRhID0gbmV3IFNldDxzdHJpbmc+KFsnXCInLCAnJicsICdeJywgJyUnXSk7XG4gIHJldHVybiB4LnNwbGl0KCcnKS5tYXAoYyA9PiBzaGVsbE1ldGEuaGFzKHgpID8gJ14nICsgYyA6IGMpLmpvaW4oJycpO1xufVxuIl19