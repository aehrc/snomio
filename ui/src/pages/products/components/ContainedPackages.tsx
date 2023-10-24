import {useState} from "react";
import {getDefaultUnit} from "../../../utils/helpers/conceptUtils.ts";
import {MedicationPackageQuantity} from "../../../types/authoring.ts";
import {InnerBox, Level1Box, Level2Box} from "./style/ProductBoxes.tsx";
import Box from "@mui/material/Box";
import {Grid, IconButton, Tab, Tabs, Tooltip} from "@mui/material";
import CustomTabPanel, {a11yProps} from "./CustomTabPanel.tsx";
import {AddCircle, Delete} from "@mui/icons-material";
import SearchAndAddIcon from "../../../components/icons/SearchAndAddIcon.tsx";
import PackageSearchAndAddModal from "./PackageSearchAndAddModal.tsx";
import ConfirmationModal from "../../../themes/overrides/ConfirmationModal.tsx";
import {Stack} from "@mui/system";
import ContainedProducts from "./ContainedProducts.tsx";

interface ContainedPackagesProps {

}

function ContainedPackages(props: ContainedPackagesProps) {


  const [value, setValue] = React.useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultUnit] = useState(getDefaultUnit(units));
  const handleToggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const [disabled, setDisabled] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(-1);

  const handleDeletePackage = () => {
    // arrayHelpers.remove(indexToDelete);
    setDeleteModalOpen(false);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handlePackageCreation = () => {
    const medicationPackageQty: MedicationPackageQuantity = {
      unit: defaultUnit,
      value: 1,
      packageDetails: {
        externalIdentifiers: [],
        containedPackages: [],
        containedProducts: [{ productDetails: { activeIngredients: [{}] } }],
      },
    };
    // arrayHelpers.push(medicationPackageQty);
    setValue(values.containedPackages.length);
  };

  const handleSearchAndAddPackage = () => {
    handleToggleModal();
    setValue(values.containedPackages.length);
  };

  return (
    <>
      <Level1Box component="fieldset">
        <legend>Contained Packages</legend>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="package tab"
          >
            {values.containedPackages?.map((containedPackage, index) => (
              <Tab
                label={
                  <Tooltip
                    title={
                      containedPackage?.packageDetails?.productName
                        ? containedPackage?.packageDetails?.productName?.pt
                            .term
                        : 'untitled*'
                    }
                  >
                    <span>
                      {containedPackage?.packageDetails?.productName
                        ? containedPackage?.packageDetails?.productName?.pt
                            .term
                        : 'untitled*'}
                    </span>
                  </Tooltip>
                }
                sx={{
                  color: !containedPackage?.packageDetails?.productName
                    ? 'red'
                    : 'inherit',
                }}
                {...a11yProps(index)}
                key={index}
              />
            ))}
            <Tab
              icon={
                <Tooltip title="Create new package">
                  <AddCircle />
                </Tooltip>
              }
              onClick={handlePackageCreation}
              {...a11yProps(
                values.containedPackages?.length
                  ? values.containedPackages?.length + 1
                  : 0,
              )}
              key={
                values.containedPackages?.length
                  ? values.containedPackages?.length + 1
                  : 0
              }
            />
            <Tab
              label={
                <Tooltip title="Search and add an existing package">
                  <span>
                    <SearchAndAddIcon width={'20px'} />
                  </span>
                </Tooltip>
              }
              onClick={handleSearchAndAddPackage}
              {...a11yProps(
                values.containedPackages?.length
                  ? values.containedPackages?.length + 2
                  : 1,
              )}
              key={
                values.containedPackages?.length
                  ? values.containedPackages?.length + 2
                  : 1
              }
            />
          </Tabs>
          <PackageSearchAndAddModal
            open={modalOpen}
            handleClose={handleToggleModal}
            arrayHelpers={arrayHelpers}
            defaultUnit={defaultUnit as Concept}
          />
        </Box>
        {values.containedPackages?.map((containedPackage, index) => (
          <CustomTabPanel value={value} index={index} key={index}>
            <Grid container justifyContent="flex-end">
              <ConfirmationModal
                open={deleteModalOpen}
                content={`Remove the package "${
                  containedPackage.packageDetails.productName
                    ? containedPackage.packageDetails.productName?.pt.term
                    : 'Untitled'
                }" ?`}
                handleClose={() => {
                  setDeleteModalOpen(false);
                }}
                title={'Confirm Delete Package'}
                disabled={disabled}
                action={'Delete'}
                handleAction={handleDeletePackage}
              />
              <IconButton
                onClick={() => {
                  setIndexToDelete(index);
                  setDeleteModalOpen(true);
                  // arrayHelpers.remove(index);
                }}
                aria-label="delete"
                size="small"
                color="error"
              >
                <Tooltip title={'Delete Package'}>
                  <Delete />
                </Tooltip>
              </IconButton>
            </Grid>
            <FieldArray
              name={`containedPackages[${index}].packageDetails.containedProducts`}
            >
              {arrayHelpers => (
                <>
                  <Level2Box component="fieldset">
                    <legend>Package Details</legend>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Grid item xs={4}>
                        <InnerBox component="fieldset">
                          <legend>Brand Name</legend>
                          <Field
                            name={`containedPackages[${index}].packageDetails.productName`}
                            id={`containedPackages[${index}].packageDetails.productName`}
                            getOptionLabel={(option: Concept) =>
                              option.pt.term
                            }
                            optionValues={brandProducts}
                            searchType={ConceptSearchType.brandProducts}
                            component={ProductAutocomplete}
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            // disableClearable={true}
                          />
                        </InnerBox>
                      </Grid>

                      <Grid item xs={4}>
                        <InnerBox component="fieldset">
                          <legend>Container Type</legend>
                          <Field
                            name={`containedPackages[${index}].packageDetails.containerType`}
                            id={`containedPackages[${index}].packageDetails.containerType`}
                            optionValues={containerTypes}
                            getOptionLabel={(option: Concept) =>
                              option.pt.term
                            }
                            searchType={ConceptSearchType.containerTypes}
                            component={ProductAutocomplete}
                            fullWidth
                            variant="outlined"
                            margin="dense"
                          />
                        </InnerBox>
                      </Grid>
                      <Grid item xs={3}>
                        <InnerBox component="fieldset">
                          <legend>ARTG ID</legend>
                          <Field
                            name={`containedPackages[${index}].packageDetails.externalIdentifiers`}
                            id={`containedPackages[${index}].packageDetails.externalIdentifiers`}
                            optionValues={[]}
                            getOptionLabel={(option: ExternalIdentifier) =>
                              option.identifierValue
                            }
                            multiple
                            freeSolo
                            component={ArtgAutocomplete}
                            fullWidth
                            variant="outlined"
                            margin="dense"
                          />
                        </InnerBox>
                      </Grid>
                    </Stack>

                    <InnerBox component="fieldset">
                      <legend>Quantity</legend>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems={'center'}
                      >
                        <Grid item xs={1}>
                          <Field
                            as={TextField}
                            name={`containedPackages[${index}].value`}
                            id={`containedPackages[${index}].value`}
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                            value={containedPackage.value || 1}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Field
                            name={`containedPackages[${index}].unit`}
                            id={`containedPackages[${index}].unit`}
                            defaultOption={defaultUnit}
                            optionValues={units}
                            getOptionLabel={(option: Concept) =>
                              option.pt.term
                            }
                            searchType={ConceptSearchType.units}
                            component={ProductAutocomplete}
                            sx={{ maxWidth: '95%' }}
                          />
                        </Grid>
                      </Stack>
                    </InnerBox>
                  </Level2Box>
                  <br />
                  <ContainedProducts
                    packageIndex={index}
                    partOfPackage={true}
                    showTPU={true}
                    arrayHelpers={arrayHelpers}
                    units={units}
                    doseForms={doseForms}
                    brandProducts={brandProducts}
                    ingredients={ingredients}
                  />
                </>
              )}
            </FieldArray>
          </CustomTabPanel>
        ))}
      </Level1Box>
    </>
  );
}
export default ContainedPackages;