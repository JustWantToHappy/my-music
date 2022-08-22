import { useSearchParams, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Button, Divider, Form, Input, message, Upload } from "antd"
import ImgCrop from "antd-img-crop"
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from "react"
import axios from "axios"
import { updateCoverImage } from "../../api/user"
import styles from "./styles/editsonglist.module.scss"
import constantsStore from "../../mobx/constants"
interface UploadRequestOption<T = any> {
    action: string,
    file: File,
    filename: string,
    headers: { [key: string]: string },
    method: string,
    withCredentials: boolean,
    onProgress?: (event: any) => void,
    onError?: (event: any | ProgressEvent, body?: T) => void,
    onSuccess?: (body: T, xhr: XMLHttpRequest) => void,

}
const EditSongList = () => {
    const { TextArea } = Input;
    const [search, setSearch] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const listname = useLocation().state as string;
    //表单名称
    const [name, setName] = useState("");
    //表单介绍
    const [desc, setDesc] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([
    ]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const beforeUpload = (file: UploadFile) => {
        if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg')) {
            message.warning("上传的文件格式不正确");
            return false;
        }
        return true;
    }
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const uploadImage = async (e: any) => {
        console.log(e, '上传');
        var formData = new FormData();
        formData.append("imgFile", e.file);
        try {
            let res = await updateCoverImage(id as string, localStorage.getItem("cookies") as string, formData);
            if (res.code === 200) {
                e.onSuccess("上传成功");
            } else {
                e.onError("上传失败");
            }
        } catch (e) {
            console.log(e);
        }
    }
    //提交表单数据
    const submitFormData=()=>{
        
    }
    return (
        <div className={styles.edit}>
            <header>
                <Button onClick={() => { navigate(-1) }} type="link">{listname}</Button>
                <small>&gt;&nbsp;</small>
                <small>编辑歌单</small>
            </header>
            <Divider />
            <div className={styles.form}>
                <Form
                    name="basic"
                    autoComplete="off"
                >
                    <Form.Item
                        label="歌单名称"
                        name="name"
                        rules={[{ required: true, message: "歌单名称不能为空" }]}
                    >
                        <Input allowClear onChange={(e) => { setName(e.target.value) }} />
                    </Form.Item>

                    <Form.Item label="介绍" name="desc" style={{ paddingLeft: '3vw' }} >
                        <TextArea
                            value={desc}
                            maxLength={1000}
                            showCount
                            autoSize={{ minRows: 10, maxRows: 10 }}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={submitFormData}>提交保存</Button>
                        <Button style={{ transform: 'translateX(1vw)' }} onClick={() => { navigate(-1) }}>取消</Button>
                    </Form.Item>
                </Form>
                <div>
                    <Form>
                        <Form.Item name="imgFile">
                            <ImgCrop rotate>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onChange}
                                    onPreview={onPreview}
                                    maxCount={1}
                                    beforeUpload={beforeUpload}
                                    customRequest={uploadImage}
                                >
                                    {'+ Upload'}
                                </Upload>
                            </ImgCrop>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default EditSongList;