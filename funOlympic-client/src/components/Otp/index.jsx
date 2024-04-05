import OTPInput from "react-otp-input";

const OTPInputBox = ({ otp, handleOTPChange, noOfInputs }) => (
  <div>
    <OTPInput
      value={otp}
      onChange={handleOTPChange}
      numInputs={noOfInputs}
      shouldAutoFocus={true}
      inputType="number"
      containerStyle={{
        gap: "10px",
        alignItems: "center",
        justifyContent: "center",
      }}
      skipDefaultStyles={true}
      renderInput={(props) => (
        <input
          {...props}
          className="w-8 font-intel h-8 text-center outline-none text-sm sm:text-xl sm:w-12 sm:h-12"
          type="number"
        />
      )}
    />
  </div>
);

export default OTPInputBox;
