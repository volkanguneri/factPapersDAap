import React from "react";
import { BarLoader } from "react-spinners";

const Spinner = ({ loading }) => {
  return <BarLoader color={"#36D7B7"} loading={loading} />;
};

export default Spinner;
