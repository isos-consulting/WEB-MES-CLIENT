import React, {
  ChangeEvent,
  useCallback,
  useRef,
  useState,
  useEffect,
  forwardRef,
} from 'react';
import { OptRow } from 'tui-grid/types/options';
import { executeData, getStorageValue } from '~/functions';
import { Button } from '..';
import './dragDrop.ui.styled.scss';
import { EDIT_ACTION_CODE } from '../datagrid-new/datagrid.ui.type';
import { WORD } from '~/constants/lang/ko';
import { isNull } from '~/helper/common';

interface IFileTypes {
  id: number;
  object: File;
}

function getFileNameType(filename: string, returnType?: 'name' | 'ext') {
  if (returnType === 'name') {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  } else if (returnType === 'ext') {
    return (
      filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
      filename
    );
  }
}

const BaseDragDrop = forwardRef((props, gridRef) => {
  const [, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<IFileTypes[]>([]);

  const dragRef = useRef<HTMLLabelElement | null>(null);

  const newForm = (bodyContent: any) => {
    const formData = new FormData();

    Object.keys(bodyContent).forEach((key: string) => {
      formData.append(key, bodyContent[key]);
    });

    return formData;
  };

  const uploadUserFile = async (requestHeader: Object) => {
    let fileInfo: OptRow = {};

    const response = await executeData(
      requestHeader,
      '/temp/file',
      'post',
      'data',
      false,
      import.meta.env.VITE_FILE_SERVER_URL,
    );

    if (response.success) {
      fileInfo = response.datas.raws[0];
    }
    return fileInfo;
  };

  const appendRow = file => {
    gridRef.current?.getInstance().appendRow({
      ...file,
      save_type: 'CREATE',
      _edit: EDIT_ACTION_CODE.CREATE,
    });
  };

  const putUserFileInfo = async (userFile: File) => {
    const requestHeader: Object = newForm({
      file: userFile,
      file_nm: getFileNameType(userFile.name, 'name'),
      file_extension: getFileNameType(userFile.name, 'ext'),
      tenant: getStorageValue({
        storageName: 'tenantInfo',
        keyName: 'tenantUuid',
      }),
    });
    const rowInfo = await uploadUserFile(requestHeader);

    if (props?.onAppendRow) {
      props?.onAppendRow(rowInfo);
    } else {
      appendRow(rowInfo);
    }
  };

  const putStorage = async (fileList: FileList | null) => {
    const concreatedFileList: FileList = isNull(files) ? new FileList() : files;
    const requests = Array.from(concreatedFileList).map(userFile =>
      putUserFileInfo(userFile),
    );

    await Promise.all(requests);
  };

  const onChangeFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement> | any): void => {
      putStorage(e.target.files);
    },
    [files],
  );

  const handleFilterFile = useCallback(
    (id: number): void => {
      setFiles(files.filter((file: IFileTypes) => file.id !== id));
    },
    [files],
  );

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer?.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles],
  );

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn);
      dragRef.current.addEventListener('dragleave', handleDragOut);
      dragRef.current.addEventListener('dragover', handleDragOver);
      dragRef.current.addEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn);
      dragRef.current.removeEventListener('dragleave', handleDragOut);
      dragRef.current.removeEventListener('dragover', handleDragOver);
      dragRef.current.removeEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return (
    <div className="DragDrop">
      <input
        type="file"
        id="fileUpload"
        style={{ display: 'none' }}
        multiple={true}
        onChange={onChangeFiles}
      />
      <Button
        id="fileUpload"
        btnType="buttonFill"
        widthSize="medium"
        heightSize="small"
        fontSize="small"
        ImageType="cancel"
        onClick={() => {
          let input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.onchange = onChangeFiles;
          input.click();
        }}
      >
        {WORD.LOAD}
      </Button>

      <div className="DragDrop-Files">
        {files.length > 0 &&
          files.map((file: IFileTypes) => {
            const {
              id,
              object: { name },
            } = file;

            return (
              <div key={id}>
                <div>{name}</div>
                <div
                  className="DragDrop-Files-Filter"
                  onClick={() => handleFilterFile(id)}
                >
                  X
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
});

const DragDrop = React.memo(BaseDragDrop);

export default DragDrop;
