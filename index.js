import Chart from "./components/chart/main.vue";
import FormulaEditor from "./components/formula-editor/main.vue";
import Cascader2 from "./components/cascader2/main.vue";
import { deleteItemByIndex } from "./functions/dataExecutor";
import {
  genNumArray,
  genRandomNumber,
  genRandomNumArr,
} from "./functions/dataGenerator";
import { arrangeObjForTableQuery, callParentFn } from "./utils/index";

export { Chart, FormulaEditor, Cascader2 };
export { deleteItemByIndex };
export { genNumArray, genRandomNumber, genRandomNumArr };
export { arrangeObjForTableQuery, callParentFn };
