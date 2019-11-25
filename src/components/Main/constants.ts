import { NotebookProps } from "../../common/types";

const notebooks: NotebookProps[] = [
  {
    id: '1',
    imgSrc: "images/fast.ai.png",
    title: "fast.ai focused notebooks IDE",
    text: `Includes latest fast.ai as well as classical Notebook IDE (since fast.ai is not yet fully compatible with JupyterLab).`,
    author: 'Viacheslav Kovalevskyi',
    lastUpdateDate: new Date(2019, 9, 12),
  },
];

export {notebooks};