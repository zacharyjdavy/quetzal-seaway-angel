const context = (require as any).context(
  '../images',
  true,
  /\.(gif|jpg|png|svg)$/
);

export const imageNameToPath = _(context.keys())
  .map((key) => [key.substring(2), context(key)]) // substring to remove `./`
  .fromPairs()
  .value();

(window as any).image_path = (imageName: any) => imageNameToPath[imageName];
