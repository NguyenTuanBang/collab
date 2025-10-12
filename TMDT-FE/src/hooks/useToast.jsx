import { addToast } from "@heroui/react";

export default function useToast() {
  const show = ({ title, description, color = "primary", duration = 3000 }) => {
    addToast({
      title,
      description,
      color,
      duration,
    });
  };

  return {
    show,
    success: (title, description, duration = 3000) =>
      show({ title, description, color: "success", duration }),
    error: (title, description, duration = 3000) =>
      show({ title, description, color: "danger", duration }),
    warning: (title, description, duration = 3000) =>
      show({ title, description, color: "warning", duration }),
    info: (title, description, duration = 3000) =>
      show({ title, description, color: "primary", duration }),
  };
}
