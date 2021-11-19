import { readFileSync } from "fs";

/**
 * Options for FileReadorator decorator.
 */
export interface FileReadoratorOption {
  /**
   * The file will be read only once.
   * @default true
   */
  cache?: boolean;

  /**
   * Whether the path for file can change or not.
   * @default true
   */
  canChange?: boolean;

  /**
   * Desired encoding to read the file in.
   * @default 'utf8'
   */
  encoding?: BufferEncoding;

  /**
   * Transforms the content of file.
   */
  transformer?(value: string): any;
}

/**
 * Decorates a property to read file from given path.
 *
 * @param option Options for FileReadorator decorator.
 * @returns
 */
export const FileReadorator =
  (option?: FileReadoratorOption): PropertyDecorator =>
  (_target, propertyKey) => {
    let filePath: string | undefined = undefined;
    const cache = option?.cache ?? true;
    const canChange = option?.canChange ?? true;
    const encoding: BufferEncoding = option?.encoding ?? "utf8";
    const transformer = option?.transformer;

    let currentValue: any | undefined = undefined;

    return {
      get: function (this: Record<string | symbol, any>) {
        if (filePath === undefined) {
          throw new Error(
            `property '${String(
              propertyKey
            )}' is not initialized yet and thus can not be accessed.`
          );
        }

        if (currentValue !== undefined && cache === true) {
          return currentValue;
        }

        currentValue = readFileSync(filePath, encoding);

        if (transformer !== undefined) {
          currentValue = transformer(currentValue);
        }

        return currentValue;
      },
      set: function (this: Record<string | symbol, any>, value: string) {
        if (typeof value !== "string") {
          throw new Error(
            `Only 'string' is allowed to be set on '${String(
              propertyKey
            )}' of FileReadorator`
          );
        }

        if (filePath !== undefined && canChange === false) {
          throw new Error(
            `'canChange' is set to false, you can not change filePath of '${String(
              propertyKey
            )}'`
          );
        }

        filePath = value;
      },
    };
  };

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
