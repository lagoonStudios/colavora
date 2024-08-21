import { ICodOptions } from "@molecules/ShipmentActionsComplete/ShipmentActionsComplete.types";

export interface ICODSelected {
  codsSelected: ICodOptions[];
  setVisible: () => void;
}
