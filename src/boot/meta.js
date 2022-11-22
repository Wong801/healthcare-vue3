import { boot } from "quasar/wrappers";
import Meta from "vue-meta";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // something to do
  app.use(Meta, {
    keyName: "app name",
    contentKeyName: "Health Care",
  });
});
