import { Sequelize } from "sequelize";
import { DocumentQueryResponseOutgoing } from "@metriport/ihe-gateway-sdk";
import { DocumentQueryResult } from "../../external/carequality/document-query-result";
import { ModelSetup } from "../_default";
import { BaseIHEResultModel } from "./ihe-result";

export class DocumentQueryResultModel
  extends BaseIHEResultModel<DocumentQueryResultModel>
  implements DocumentQueryResult
{
  static NAME = "document_query_result";
  declare data: DocumentQueryResponseOutgoing;

  static setup: ModelSetup = (sequelize: Sequelize) => {
    DocumentQueryResultModel.init(BaseIHEResultModel.attributes(), {
      ...BaseIHEResultModel.modelOptions(sequelize),
      tableName: DocumentQueryResultModel.NAME,
    });
  };
}
