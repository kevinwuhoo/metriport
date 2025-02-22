import { capture } from "../../shared/notifications";
import { buildDocIdFHIRExtension } from "@metriport/core/external/fhir/shared/extensions/doc-id-extension";
import { makeSidechainFHIRConverterConnector } from "./connector-factory";
import { MedicalDataSource } from "@metriport/core/external/index";

const connector = makeSidechainFHIRConverterConnector();

export async function sidechainConvertCDAToFHIR(params: {
  patient: { cxId: string; id: string };
  document: { id: string; mimeType?: string };
  s3FileName: string;
  s3BucketName: string;
  requestId: string;
  source?: MedicalDataSource;
}): Promise<void> {
  const {
    patient,
    document: { id: documentId },
    s3FileName,
    s3BucketName,
    requestId,
    source,
  } = params;
  // Build an extension to be added to all resources created by this conversion
  // so we can get the original doc ref from the resource
  const documentExtension = buildDocIdFHIRExtension(s3FileName);
  try {
    return connector.requestConvert({
      cxId: patient.cxId,
      patientId: patient.id,
      documentId: documentId,
      payload: JSON.stringify({ s3FileName, s3BucketName, documentExtension }),
      requestId,
      source,
    });
  } catch (error) {
    console.log(
      `Error requesting CDA to FHIR conversion using sidechain converter: ${error}`,
      params
    );
    capture.error(error, {
      extra: { context: `sidechainConvertCDAToFHIR`, ...params },
    });
    throw error;
  }
}
