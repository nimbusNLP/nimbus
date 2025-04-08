"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        include: ['**/*.test.ts', '**/*.vitest.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/cdk.out/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            include: ['lib/**/*.ts', 'bin/**/*.ts'],
            exclude: ['**/*.test.ts', '**/*.vitest.ts', '**/node_modules/**', '**/dist/**', '**/cdk.out/**'],
            thresholds: {
                statements: 50,
                branches: 50,
                functions: 50,
                lines: 50
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidml0ZXN0LmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpdGVzdC5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBNkM7QUFFN0Msa0JBQWUsSUFBQSxxQkFBWSxFQUFDO0lBQzFCLElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxJQUFJO1FBQ2IsV0FBVyxFQUFFLE1BQU07UUFDbkIsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGdCQUFnQixDQUFDO1FBQzNDLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7UUFDOUQsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDMUMsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQztZQUN2QyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQztZQUNoRyxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsS0FBSyxFQUFFLEVBQUU7YUFDVjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdub2RlJyxcbiAgICBpbmNsdWRlOiBbJyoqLyoudGVzdC50cycsICcqKi8qLnZpdGVzdC50cyddLFxuICAgIGV4Y2x1ZGU6IFsnKiovbm9kZV9tb2R1bGVzLyoqJywgJyoqL2Rpc3QvKionLCAnKiovY2RrLm91dC8qKiddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICAgIHJlcG9ydGVyOiBbJ3RleHQnLCAnanNvbicsICdodG1sJywgJ2xjb3YnXSxcbiAgICAgIGluY2x1ZGU6IFsnbGliLyoqLyoudHMnLCAnYmluLyoqLyoudHMnXSxcbiAgICAgIGV4Y2x1ZGU6IFsnKiovKi50ZXN0LnRzJywgJyoqLyoudml0ZXN0LnRzJywgJyoqL25vZGVfbW9kdWxlcy8qKicsICcqKi9kaXN0LyoqJywgJyoqL2Nkay5vdXQvKionXSxcbiAgICAgIHRocmVzaG9sZHM6IHtcbiAgICAgICAgc3RhdGVtZW50czogNTAsXG4gICAgICAgIGJyYW5jaGVzOiA1MCxcbiAgICAgICAgZnVuY3Rpb25zOiA1MCxcbiAgICAgICAgbGluZXM6IDUwXG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiJdfQ==