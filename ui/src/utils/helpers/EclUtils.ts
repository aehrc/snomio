import { FieldBindings, FieldEclGenerated } from '../../types/FieldBindings.ts';
import { UseFormGetValues } from 'react-hook-form';
import {
  DevicePackageDetails,
  MedicationPackageDetails,
} from '../../types/product.ts';

export const ECL_DEFAULT_CONCEPT_SEARCH = '%5E%20929360051000036108'; //^ 929360051000036108
export const ECL_MEDICATION_CONCEPT_SEARCH =
  '%5E%20929360051000036108%20AND%20%3C%20781405001'; //^ 929360051000036108 AND < 781405001
export const ECL_DEVICE_CONCEPT_SEARCH =
  '%5E%20929360051000036108%20AND%20%3C%20999000071000168104'; //^ 929360051000036108 AND < 999000071000168104
export const ECL_UNITS = '%3C767524001'; //<767524001
export const ECL_CONTAINER_TYPES = '%3C706437002'; //<706437002
export const ECL_INGREDIENTS = '%3C105590001'; //<105590001
export const ECL_DOSE_FORMS = '%3C736542009'; //<736542009
export const ECL_BRAND_PRODUCTS = '%3C774167006'; //<774167006

export const ECL_EXCLUDE_PACKAGES =
  '%28%5E%20929360051000036108%29%20%3A%20%5B0..0%5D%20999000011000168107%20%3D%20%2A'; //(^ 929360051000036108) : [0..0] 999000011000168107 = *

export const ECL_EXISTING_PRODUCT_TO_PACKAGE = '%5E%20929360031000036100'; //^ 929360031000036100

export const ECL_DEVICE_TYPE = '%3C%2049062001'; //< 49062001
export const ECL_MEDICATION_DEVICE_TYPE = '%3C%2063653004'; //< 63653004;

export function appendIdsToEcl(ecl: string, idArray: string[]) {
  const ids = idArray.join(' OR ');
  ecl = encodeURIComponent('(') + ecl + encodeURIComponent(`) AND (${ids})`);
  return ecl;
}
export function generateEclFromBinding(
  bindings: FieldBindings,
  bindingKey: string,
) {
  const ecl = bindings.bindingsMap.get(bindingKey) as string;
  if (ecl.includes('@')) {
    throw new Error('Invalid binding found please check');
  }
  return ecl;
}

export function generateEclForMedication(
  bindings: FieldBindings,
  bindingKey: string,
  index: number,
  productsArray: string,
  getValues: UseFormGetValues<MedicationPackageDetails>,
): FieldEclGenerated {
  const ecl = bindings.bindingsMap.get(bindingKey) as string;
  let generatedEcl = ecl;
  const eclFieldOut: FieldEclGenerated = {
    actualEcl: ecl,
    generatedEcl: generatedEcl,
    relatedFields: [],
  };

  if (ecl.includes('@')) {
    let parent;
    let parentIdent;
    if (generatedEcl.includes('@medicationProduct.genericForm')) {
      parent = getValues(
        `${productsArray}[${index}].productDetails.genericForm` as 'containedProducts.0.productDetails.genericForm',
      );
      generatedEcl = generatedEcl.replace(
        /@medicationProduct.genericForm/gi,
        parent?.conceptId as string,
      );
      parentIdent = 'medicationProduct.genericForm';
    } else if (
      generatedEcl.includes(
        '@medicationProduct.activeIngredients.activeIngredient',
      )
    ) {
      parent = getValues(
        `${productsArray}[${index}].activeIngredient` as 'containedProducts.0.productDetails.activeIngredients.0.activeIngredient',
      );
      generatedEcl = generatedEcl.replace(
        /@medicationProduct.activeIngredients.activeIngredient/gi,
        parent?.conceptId as string,
      );
      parentIdent = '@medicationProduct.activeIngredients.activeIngredient';
    }
    eclFieldOut.relatedFields.push({
      relatedTo: parentIdent,
      relatedValue: parent,
    });
    eclFieldOut.generatedEcl = generatedEcl;
  }
  return eclFieldOut;
}
export function generateEclForDevice(
  bindings: FieldBindings,
  bindingKey: string,
  index: number,
  productsArray: string,
  getValues: UseFormGetValues<DevicePackageDetails>,
): FieldEclGenerated {
  const ecl = bindings.bindingsMap.get(bindingKey) as string;
  let generatedEcl = ecl;
  const eclFieldOut: FieldEclGenerated = {
    actualEcl: ecl,
    generatedEcl: generatedEcl,
    relatedFields: [],
  };

  if (ecl.includes('@')) {
    let parent;
    let parentIdent;
    if (generatedEcl.includes('@deviceProduct.deviceType')) {
      parent = getValues(
        `${productsArray}[${index}].productDetails.deviceType` as 'containedProducts.0.productDetails.deviceType',
      );
      generatedEcl = generatedEcl.replace(
        /@deviceProduct.deviceType/gi,
        parent?.conceptId as string,
      );
      parentIdent = 'deviceProduct.deviceType';
    }
    eclFieldOut.relatedFields.push({
      relatedTo: parentIdent,
      relatedValue: parent,
    });
    eclFieldOut.generatedEcl = generatedEcl;
  }
  return eclFieldOut;
}
