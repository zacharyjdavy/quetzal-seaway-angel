export function makeProvider(name: string) {
  return {
    provide: name,
    useFactory($injector: any) {
      return $injector.get(name);
    },
    deps: ['$injector'],
  };
}
