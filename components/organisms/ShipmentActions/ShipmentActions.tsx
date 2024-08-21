import React, { useState } from "react";

import ShipmentActionsDefault from "@molecules/ShipmentActionsDefault";
import ShipmentActionsException from "@molecules/ShipmentActionsException";
import ShipmentActionsComplete from "@molecules/ShipmentActionsComplete";

import { ShipmentActionsButtonItem } from "./ShipmentAction.constants";
import { IShipmentActions } from "./ShipmentActions.types";
export default function ShipmentActions({ setSelectedTab }: IShipmentActions) {
  // --- Local state -----------------------------------------------------------
  const [option, setOption] = useState<ShipmentActionsButtonItem>(
    ShipmentActionsButtonItem.DEFAULT
  );
  const components = [
    <ShipmentActionsDefault key="shipment-default" setOption={setOption} />,
    <ShipmentActionsException
      key="shipment-exception"
      setSelectedTab={setSelectedTab}
    />,
    <ShipmentActionsComplete
      setSelectedTab={setSelectedTab}
      key="shipment-complete"
    />,
  ];
  // --- END: Local state ------------------------------------------------------

  return <>{components[option]}</>;
}
