import { useCallback, useRef, useState } from "react";
import { Container, getId, Menu, TemplateDetail } from "@atrilabs/core";
import {
  amber300,
  gray300,
  gray700,
  gray800,
  gray900,
  h1Heading,
  h4Heading,
  IconMenu,
  smallText,
} from "@atrilabs/design-system";
import { ReactComponent as OpenTemplateIcon } from "./assets/open-template.svg";
import { Cross } from "./assets/Cross";
import { useComponentSelected } from "./hooks/useComponentSelected";
import { useCreateTemplate } from "./hooks/useCreateTemplate";
import { useTemplateApi } from "./hooks/useTemplateApi";
import { startDrag } from "@atrilabs/canvas-runtime";
import { DragTemplateComp } from "./components/DragTemplateComp";
import "./styles.css";
import { ConfirmDelete } from "./components/ConfirmDelete";
import { formatTemplateName } from "./utils";
import { useTemplateCopyPaste } from "./hooks/useTemplateCopyPaste";
import { useShowTemplate } from "./hooks/useShowTemplate";
import { TemplateRenderer } from "./components/TemplateRenderer";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
  },
  dropContainerItem: {
    width: "15rem",
    height: `100%`,
    backgroundColor: gray700,
    boxSizing: "border-box",
    userSelect: "none",
    overflow: "auto",
  },
  dropContainerItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
  },
  dropContainerItemHeaderH4: {
    ...h1Heading,
    color: gray300,
    margin: "0px",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  iconsSpan: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    width: "1.3rem",
  },
  outerDiv: {
    ...smallText,
    color: gray300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    borderLeft: `1px solid ${gray800}`,
    borderRight: `1px solid ${gray800}`,
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    userSelect: "none",
  },
  popupDiv: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "100%",
    backgroundColor: "black",
    width: "10rem",
    zIndex: 1,
    right: 0,
  },
};

export default function () {
  const {
    templateDetails,
    callCreateTeamplateApi,
    callDeleteTemplateApi,
    relativeDirs,
    sortedRelativeDirs,
  } = useTemplateApi();

  const [showDropPanel, setShowDropContianer] = useState<boolean>(false);
  const openDropContainer = useCallback(() => {
    setShowDropContianer(true);
  }, []);
  const closeContainer = useCallback(() => {
    setShowDropContianer(false);
  }, []);

  const { selected } = useComponentSelected();
  const createTemplate = useCreateTemplate();
  const [showCreateTemplatePopup, setShowCreateTemplatePopup] =
    useState<boolean>(false);
  const createTempalateInputRef = useRef<HTMLInputElement>(null);
  const createTemplateSelect = useRef<HTMLSelectElement>(null);
  const onCreateTemplateClickCb = useCallback(() => {
    setShowCreateTemplatePopup(true);
  }, []);
  const onCreateTemplatePopupCrossClickCb = useCallback(() => {
    setShowCreateTemplatePopup(false);
  }, []);
  const onCreateClickCb = useCallback(() => {
    if (
      selected &&
      templateDetails &&
      createTempalateInputRef.current &&
      createTemplateSelect.current
    ) {
      const templateEvents = createTemplate(selected, {
        copyCallbacks: true,
        copyDefaulCallbacks: false,
      });
      if (templateEvents.length > 0) {
        callCreateTeamplateApi(templateEvents, {
          relativeDir: createTemplateSelect.current.value,
          templateName: createTempalateInputRef.current.value,
        });
      }
    }
    setShowCreateTemplatePopup(false);
  }, [createTemplate, selected, templateDetails, callCreateTeamplateApi]);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState<TemplateDetail | null>(null);
  const onDeleteConfirm = useCallback(() => {
    if (showDeleteDialog) callDeleteTemplateApi(showDeleteDialog);
    setShowDeleteDialog(null);
  }, [showDeleteDialog, callDeleteTemplateApi]);
  const onDeleteCancel = useCallback(() => {
    setShowDeleteDialog(null);
  }, []);

  useTemplateCopyPaste();

  const selectedDir =
    sortedRelativeDirs.length > 0 ? sortedRelativeDirs[0] : "";

  const { formattedData } = useShowTemplate(selectedDir, templateDetails || []);

  return (
    <>
      <Menu name="PageMenu" order={1}>
        <div style={styles.iconContainer}>
          <IconMenu onClick={openDropContainer} active={false}>
            <OpenTemplateIcon />
          </IconMenu>
        </div>
      </Menu>

      {showDropPanel ? (
        <Container name="Drop" onClose={closeContainer}>
          <div style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Select Template</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
            <div>
              <div>
                <div
                  style={{
                    padding: "0.5rem",
                    backgroundColor: gray900,
                    ...h4Heading,
                    color: gray300,
                  }}
                >
                  {selectedDir}
                </div>
                {formattedData.map(({ name, components }) => {
                  const formatName = formatTemplateName(name);
                  const onMouseDownCb = () => {
                    startDrag(
                      { comp: DragTemplateComp, props: { text: formatName } },
                      {
                        type: "template",
                        data: {
                          dir: selectedDir,
                          name: name,
                          newTemplateRootId: getId(),
                        },
                      }
                    );
                  };
                  return (
                    <div
                      key={name}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      onMouseDown={onMouseDownCb}
                    >
                      <TemplateRenderer templateComponents={components} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      ) : null}

      {selected ? (
        <Menu name="PublishMenu" order={0}>
          <div style={styles.outerDiv} onClickCapture={onCreateTemplateClickCb}>
            Create Template
            {showCreateTemplatePopup ? (
              <div
                style={{
                  position: "absolute",
                  top: "2.5rem",
                  right: 0,
                  zIndex: 1,
                  background: gray800,
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Create Template</span>
                  <span onClickCapture={onCreateTemplatePopupCrossClickCb}>
                    <Cross />
                  </span>
                </div>
                <label htmlFor="templateCategory">Template Category</label>
                <select ref={createTemplateSelect}>
                  {Object.keys(relativeDirs).map((relativeDir) => {
                    return <option value={relativeDir}>{relativeDir}</option>;
                  })}
                </select>
                <label htmlFor="templateName">Template Name</label>
                <input ref={createTempalateInputRef} id="templateName" />
                <button
                  style={{
                    ...h4Heading,
                    border: "none",
                    outline: "none",
                    background: amber300,
                    borderRadius: "4px",
                    color: gray900,
                    padding: "6px 0",
                    textAlign: "center",
                    width: "13rem",
                  }}
                  onClickCapture={onCreateClickCb}
                >
                  Create
                </button>
              </div>
            ) : null}
          </div>
        </Menu>
      ) : null}

      {showDeleteDialog ? (
        <Container name="OverlayContainer" onClose={onDeleteCancel}>
          <ConfirmDelete
            templateName={showDeleteDialog.templateName}
            onCancel={onDeleteCancel}
            onDelete={onDeleteConfirm}
            onCross={onDeleteCancel}
          />
        </Container>
      ) : null}
    </>
  );
}
