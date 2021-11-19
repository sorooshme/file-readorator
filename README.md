# Intro

This package's aim is mostly toward solving docker secret issues when using `Docker Swarm` in production.

# Install

```
npm i file-readorator
```

# Usage

```typescript
class Config {
  @FileReadorator({
    cache: true,
    canChange: false,
    encoding: "utf8",
    transformer(value) {
      return value.toUpperCase();
    },
  })
  DATABASE_HOST!: string;

  @FileReadorator()
  DATABASE_PORT!: string;
}
```
