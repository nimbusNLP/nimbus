import { defineConfig } from 'vitest/config';
export default defineConfig({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidml0ZXN0LmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpdGVzdC5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3QyxlQUFlLFlBQVksQ0FBQztJQUMxQixJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsSUFBSTtRQUNiLFdBQVcsRUFBRSxNQUFNO1FBQ25CLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQztRQUMzQyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDO1FBQzlELFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxJQUFJO1lBQ2QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQzFDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUM7WUFDdkMsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7WUFDaEcsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxFQUFFO2dCQUNkLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxFQUFFO2dCQUNiLEtBQUssRUFBRSxFQUFFO2FBQ1Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnbm9kZScsXG4gICAgaW5jbHVkZTogWycqKi8qLnRlc3QudHMnLCAnKiovKi52aXRlc3QudHMnXSxcbiAgICBleGNsdWRlOiBbJyoqL25vZGVfbW9kdWxlcy8qKicsICcqKi9kaXN0LyoqJywgJyoqL2Nkay5vdXQvKionXSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCcsICdsY292J10sXG4gICAgICBpbmNsdWRlOiBbJ2xpYi8qKi8qLnRzJywgJ2Jpbi8qKi8qLnRzJ10sXG4gICAgICBleGNsdWRlOiBbJyoqLyoudGVzdC50cycsICcqKi8qLnZpdGVzdC50cycsICcqKi9ub2RlX21vZHVsZXMvKionLCAnKiovZGlzdC8qKicsICcqKi9jZGsub3V0LyoqJ10sXG4gICAgICB0aHJlc2hvbGRzOiB7XG4gICAgICAgIHN0YXRlbWVudHM6IDUwLFxuICAgICAgICBicmFuY2hlczogNTAsXG4gICAgICAgIGZ1bmN0aW9uczogNTAsXG4gICAgICAgIGxpbmVzOiA1MFxuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iXX0=