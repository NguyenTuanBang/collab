import { InputOtp } from "@heroui/react";

function InputOTP({ value, onComplete, onValueChange, isInvalid }) {
  return (
    <InputOtp
      size="lg"
      length={6}
      color="primary"
      radius="lg"
      isInvalid={isInvalid}
      value={value}
      onValueChange={onValueChange}
      onComplete={onComplete}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
}

export default InputOTP;
