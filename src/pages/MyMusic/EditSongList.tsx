import { useSearchParams, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Button, Divider, Form, Input, message, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { MouseEventHandler, useState } from 'react'
import { updateCoverImage, updateSongList } from '../../api/user'
import { throttle } from '../../utils/throttle_debounce'
import { dataURLToImage, fileToDataURL } from '../../utils'
import styles from './styles/editsonglist.module.scss'
import PubSub from 'pubsub-js'
const EditSongList = () => {
  const { TextArea } = Input
  const [search, setSearch] = useSearchParams()
  const navigate = useNavigate()
  const id = search.get('id')
  const listname = useLocation().state as string
  //表单名称
  const [name, setName] = useState('')
  //表单介绍
  const [desc, setDesc] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }
  //上传封面之前校验图片
  const beforeUpload = (file: UploadFile) => {
    if (
      !(
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/jpg'
      )
    ) {
      message.warning('上传的文件格式不正确')
      return false
    }
    let { size } = file
    const isLt5M = size && size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.warning('图片大小必须小于5M')
    }
    return true
  }
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }
  const uploadImage = async (e: any) => {
    const upload = async (width: number, height: number) => {
      //图片尺寸
      let imageSize = Math.min(width, height)
      var formData = new FormData()
      formData.append('imgFile', e.file)
      try {
        let res = await updateCoverImage(
          id as string,
          localStorage.getItem('cookies') as string,
          formData,
          imageSize,
        )
        if (res.code === 200) {
          e.onSuccess('上传成功')
        } else {
          e.onError('上传失败')
        }
      } catch (e) {
        console.log(e)
      }
    }
    fileToDataURL(e.file)
      .then((dataURL) => {
        return Promise.resolve(dataURLToImage(dataURL))
      })
      .then((image) => {
        //此时拿到的image对象是经过裁剪得到的新Image,不是原文件
        upload(image.width, image.height)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  //提交表单数据
  const submitFormData = async () => {
    if (name === '') {
      message.warning({
        content: '歌单名不能为空!',
      })
      return
    }
    let res = await updateSongList(id as string, name, desc)
    if (res.code === 200) {
      PubSub.publish('refresh', true)
    }
  }
  return (
    <div className={styles.edit}>
      <header>
        <Button
          onClick={() => {
            navigate(-1)
          }}
          type="link"
        >
          {listname}
        </Button>
        <small>&gt;&nbsp;</small>
        <small>编辑歌单</small>
      </header>
      <Divider />
      <div className={styles.form}>
        <Form name="basic" autoComplete="off">
          <Form.Item
            label="歌单名称"
            name="name"
            rules={[{ required: true, message: '歌单名称不能为空' }]}
          >
            <Input
              allowClear
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </Form.Item>

          <Form.Item label="介绍" name="desc" style={{ paddingLeft: '3vw' }}>
            <TextArea
              value={desc}
              maxLength={1000}
              showCount
              autoSize={{ minRows: 10, maxRows: 10 }}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={throttle(submitFormData, 600) as MouseEventHandler}
            >
              提交保存
            </Button>
            <Button
              style={{ transform: 'translateX(1vw)' }}
              onClick={() => {
                navigate(-1)
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
        <div>
          <Form>
            <Form.Item name="imgFile">
              <ImgCrop >
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
export default EditSongList
