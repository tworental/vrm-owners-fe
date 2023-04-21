export default function useToastr() {
  const toastr = window.toastr || {
    success: () => {},
    error: () => {},
    info: () => {},
    warning: () => {},
  };

  return { toastr };
}
