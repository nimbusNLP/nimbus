"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readIfPossible = readIfPossible;
const fs = require("fs-extra");
const logging_1 = require("../../logging");
/**
 * Read a file if it exists, or return undefined
 *
 * Not async because it is used in the constructor
 */
function readIfPossible(filename) {
    try {
        if (!fs.pathExistsSync(filename)) {
            return undefined;
        }
        return fs.readFileSync(filename, { encoding: 'utf-8' });
    }
    catch (e) {
        (0, logging_1.debug)(e);
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSx3Q0FVQztBQWxCRCwrQkFBK0I7QUFDL0IsMkNBQXNDO0FBRXRDOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQUMsUUFBZ0I7SUFDN0MsSUFBSSxDQUFDO1FBQ0gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUNqQyxPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFBQyxPQUFPLENBQU0sRUFBRSxDQUFDO1FBQ2hCLElBQUEsZUFBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBkZWJ1ZyB9IGZyb20gJy4uLy4uL2xvZ2dpbmcnO1xuXG4vKipcbiAqIFJlYWQgYSBmaWxlIGlmIGl0IGV4aXN0cywgb3IgcmV0dXJuIHVuZGVmaW5lZFxuICpcbiAqIE5vdCBhc3luYyBiZWNhdXNlIGl0IGlzIHVzZWQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkSWZQb3NzaWJsZShmaWxlbmFtZTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgdHJ5IHtcbiAgICBpZiAoIWZzLnBhdGhFeGlzdHNTeW5jKGZpbGVuYW1lKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgZGVidWcoZSk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIl19