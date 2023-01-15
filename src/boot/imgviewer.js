import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
export default async ({ Vue }) => {
  Vue.use(Viewer, {
    defaultOptions: {
      transition: false,
      zIndex: 9999,
    },
  });
};
