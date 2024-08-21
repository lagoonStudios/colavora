import React, { useState } from "react";
import { ShipmentActionsButtonItem } from "./ShipmentAction.constants";
import ShipmentActionsDefault from "@molecules/ShipmentActionsDefault";
import ShipmentActionsException from "@molecules/ShipmentActionsException";
import ShipmentActionsComplete from "@molecules/ShipmentActionsComplete";
export default function ShipmentActions() {
  // --- Local state -----------------------------------------------------------
  const [option, setOption] = useState<ShipmentActionsButtonItem>(
    ShipmentActionsButtonItem.DEFAULT,
  );
  const components = [
    <ShipmentActionsDefault key="shipment-default" setOption={setOption} />,
    <ShipmentActionsException key="shipment-exception" />,
    <ShipmentActionsComplete key="shipment-complete" />,
  ];
  // --- END: Local state ------------------------------------------------------

  return <>{components[option]}</>;
}
