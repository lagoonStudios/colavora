export interface ICODComponet {
  visible: boolean;
  setVisible: () => void;
  addCOD: (codTypeID: number, codAmount?: number, codCheck?: string) => void;
}
