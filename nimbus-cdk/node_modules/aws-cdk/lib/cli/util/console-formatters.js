"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAsBanner = formatAsBanner;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripAnsi = require('strip-ansi');
/**
 * Returns a set of strings when printed on the console produces a banner msg. The message is in the following format -
 * ********************
 * *** msg line x   ***
 * *** msg line xyz ***
 * ********************
 *
 * Spec:
 * - The width of every line is equal, dictated by the longest message string
 * - The first and last lines are '*'s for the full length of the line
 * - Each line in between is prepended with '*** ' and appended with ' ***'
 * - The text is indented left, i.e. whitespace is right-padded when the length is shorter than the longest.
 *
 * @param msgs array of strings containing the message lines to be printed in the banner. Returns empty string if array
 * is empty.
 * @returns array of strings containing the message formatted as a banner
 */
function formatAsBanner(msgs) {
    const printLen = (str) => stripAnsi(str).length;
    if (msgs.length === 0) {
        return [];
    }
    const leftPad = '*** ';
    const rightPad = ' ***';
    const bannerWidth = printLen(leftPad) + printLen(rightPad) +
        msgs.reduce((acc, msg) => Math.max(acc, printLen(msg)), 0);
    const bannerLines = [];
    bannerLines.push('*'.repeat(bannerWidth));
    // Improvement: If any 'msg' is wider than the terminal width, wrap message across lines.
    msgs.forEach((msg) => {
        const padding = ' '.repeat(bannerWidth - (printLen(msg) + printLen(leftPad) + printLen(rightPad)));
        bannerLines.push(''.concat(leftPad, msg, padding, rightPad));
    });
    bannerLines.push('*'.repeat(bannerWidth));
    return bannerLines;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS1mb3JtYXR0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc29sZS1mb3JtYXR0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBb0JBLHdDQXVCQztBQTNDRCxpRUFBaUU7QUFDakUsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRXhDOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLElBQWM7SUFDM0MsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFeEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUN2QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUM7SUFDeEIsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTdELE1BQU0sV0FBVyxHQUFhLEVBQUUsQ0FBQztJQUNqQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUUxQyx5RkFBeUY7SUFDekYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ25CLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25HLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDO0lBRUgsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDMUMsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG5jb25zdCBzdHJpcEFuc2kgPSByZXF1aXJlKCdzdHJpcC1hbnNpJyk7XG5cbi8qKlxuICogUmV0dXJucyBhIHNldCBvZiBzdHJpbmdzIHdoZW4gcHJpbnRlZCBvbiB0aGUgY29uc29sZSBwcm9kdWNlcyBhIGJhbm5lciBtc2cuIFRoZSBtZXNzYWdlIGlzIGluIHRoZSBmb2xsb3dpbmcgZm9ybWF0IC1cbiAqICoqKioqKioqKioqKioqKioqKioqXG4gKiAqKiogbXNnIGxpbmUgeCAgICoqKlxuICogKioqIG1zZyBsaW5lIHh5eiAqKipcbiAqICoqKioqKioqKioqKioqKioqKioqXG4gKlxuICogU3BlYzpcbiAqIC0gVGhlIHdpZHRoIG9mIGV2ZXJ5IGxpbmUgaXMgZXF1YWwsIGRpY3RhdGVkIGJ5IHRoZSBsb25nZXN0IG1lc3NhZ2Ugc3RyaW5nXG4gKiAtIFRoZSBmaXJzdCBhbmQgbGFzdCBsaW5lcyBhcmUgJyoncyBmb3IgdGhlIGZ1bGwgbGVuZ3RoIG9mIHRoZSBsaW5lXG4gKiAtIEVhY2ggbGluZSBpbiBiZXR3ZWVuIGlzIHByZXBlbmRlZCB3aXRoICcqKiogJyBhbmQgYXBwZW5kZWQgd2l0aCAnICoqKidcbiAqIC0gVGhlIHRleHQgaXMgaW5kZW50ZWQgbGVmdCwgaS5lLiB3aGl0ZXNwYWNlIGlzIHJpZ2h0LXBhZGRlZCB3aGVuIHRoZSBsZW5ndGggaXMgc2hvcnRlciB0aGFuIHRoZSBsb25nZXN0LlxuICpcbiAqIEBwYXJhbSBtc2dzIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyB0aGUgbWVzc2FnZSBsaW5lcyB0byBiZSBwcmludGVkIGluIHRoZSBiYW5uZXIuIFJldHVybnMgZW1wdHkgc3RyaW5nIGlmIGFycmF5XG4gKiBpcyBlbXB0eS5cbiAqIEByZXR1cm5zIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyB0aGUgbWVzc2FnZSBmb3JtYXR0ZWQgYXMgYSBiYW5uZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEFzQmFubmVyKG1zZ3M6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICBjb25zdCBwcmludExlbiA9IChzdHI6IHN0cmluZykgPT4gc3RyaXBBbnNpKHN0cikubGVuZ3RoO1xuXG4gIGlmIChtc2dzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGxlZnRQYWQgPSAnKioqICc7XG4gIGNvbnN0IHJpZ2h0UGFkID0gJyAqKionO1xuICBjb25zdCBiYW5uZXJXaWR0aCA9IHByaW50TGVuKGxlZnRQYWQpICsgcHJpbnRMZW4ocmlnaHRQYWQpICtcbiAgICBtc2dzLnJlZHVjZSgoYWNjLCBtc2cpID0+IE1hdGgubWF4KGFjYywgcHJpbnRMZW4obXNnKSksIDApO1xuXG4gIGNvbnN0IGJhbm5lckxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICBiYW5uZXJMaW5lcy5wdXNoKCcqJy5yZXBlYXQoYmFubmVyV2lkdGgpKTtcblxuICAvLyBJbXByb3ZlbWVudDogSWYgYW55ICdtc2cnIGlzIHdpZGVyIHRoYW4gdGhlIHRlcm1pbmFsIHdpZHRoLCB3cmFwIG1lc3NhZ2UgYWNyb3NzIGxpbmVzLlxuICBtc2dzLmZvckVhY2goKG1zZykgPT4ge1xuICAgIGNvbnN0IHBhZGRpbmcgPSAnICcucmVwZWF0KGJhbm5lcldpZHRoIC0gKHByaW50TGVuKG1zZykgKyBwcmludExlbihsZWZ0UGFkKSArIHByaW50TGVuKHJpZ2h0UGFkKSkpO1xuICAgIGJhbm5lckxpbmVzLnB1c2goJycuY29uY2F0KGxlZnRQYWQsIG1zZywgcGFkZGluZywgcmlnaHRQYWQpKTtcbiAgfSk7XG5cbiAgYmFubmVyTGluZXMucHVzaCgnKicucmVwZWF0KGJhbm5lcldpZHRoKSk7XG4gIHJldHVybiBiYW5uZXJMaW5lcztcbn1cbiJdfQ==