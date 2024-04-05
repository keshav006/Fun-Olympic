import { useSnackbar } from "notistack";
import X from "../icons/X";

let useSnackbarRef;

export const SnackbarUtilsConfigurator = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

const toast = (msg, variant) => {
  useSnackbarRef.enqueueSnackbar(msg, {
    variant,
    autoHideDuration: 3000,
    action: (key) => <X onClick={() => useSnackbarRef.closeSnackbar(key)} />,
  });
};

const Snackbar = {
  success(msg) {
    toast(msg, "success");
  },
  warning(msg) {
    toast(msg, "warning");
  },
  info(msg) {
    toast(msg, "info");
  },
  error(msg) {
    toast(msg, "error");
  },
  toast,
};

export default Snackbar;
