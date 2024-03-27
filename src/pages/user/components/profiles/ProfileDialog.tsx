import { DatePicker, Flex, Form, Input, InputNumber, Modal, Typography, message } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import UserAPI from '~/api/services/UserAPI'
import useAPIService from '~/hooks/useAPIService'
import { RootState } from '~/store/store'
import { User } from '~/typing'

interface Props extends React.HTMLAttributes<HTMLElement> {
  open: boolean
  setOpen: (enable: boolean) => void
}

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

function ProfileDialog({ open, setOpen }: Props) {
  const [form] = Form.useForm()
  const userService = useAPIService<User>(UserAPI)
  const [loading, setLoading] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.user)
  // const [imageUrl, setImageUrl] = useState<string>()

  const handleModalUpdate = async () => {
    try {
      setLoading(true)
      const val = await form.validateFields()
      const userUpdate: User = {
        fullName: val.fullNameProfile,
        phone: val.phoneProfile,
        birthday: val.birthdayProfile ? dayjs(val.birthdayProfile).toISOString() : null
      }
      await userService.updateItemByPk(currentUser.user.id ?? -1, userUpdate, setLoading, (meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        message.success('Updated!')
      })
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const handleModalCancel = async () => {
    setOpen(false)
  }

  // const getBase64 = (img: File, callback: (url: string) => void) => {
  //   const reader = new FileReader()
  //   reader.addEventListener('load', () => callback(reader.result as string))
  //   reader.readAsDataURL(img)
  // }

  // const uploadProps: UploadProps = {
  //   showUploadList: false,
  //   action: `${appConfig.baseUrl}/users/${currentUser.user.id}`,
  //   method: 'PUT',
  //   headers: {
  //     authorization: accessTokenStored ?? ''
  //   },
  //   data: {
  //     avatar: imageUrl
  //   },
  //   beforeUpload: (file: File) => {
  //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  //     if (!isJpgOrPng) {
  //       message.error('You can only upload JPG/PNG file!')
  //     }
  //     const isLt2M = file.size / 1024 / 1024 < 2
  //     if (!isLt2M) {
  //       message.error('Image must smaller than 2MB!')
  //     }
  //     return isJpgOrPng && isLt2M
  //   },
  //   onPreview: async (file: UploadFile) => {
  //     let src = file.url as string
  //     if (!src) {
  //       src = await new Promise((resolve) => {
  //         const reader = new FileReader()
  //         reader.readAsDataURL(file.originFileObj as FileType)
  //         reader.onload = () => resolve(reader.result as string)
  //       })
  //     }
  //     const image = new Image()
  //     image.src = src
  //     const imgWindow = window.open(src)
  //     imgWindow?.document.write(image.outerHTML)
  //   },
  //   onChange: (info) => {
  //     if (info.file.status === 'uploading') {
  //       setLoading(true)
  //       return
  //     }
  //     if (info.file.status === 'done') {
  //       // Get this url from response in real world.
  //       getBase64(info.file.originFileObj as FileType, (url) => {
  //         setLoading(false)
  //         setImageUrl(url)
  //       })
  //     }
  //   }
  // }

  return (
    <Modal
      open={open}
      onOk={handleModalUpdate}
      okText='Update'
      okButtonProps={{
        htmlType: 'submit',
        loading: loading
      }}
      onCancel={handleModalCancel}
      width={650}
    >
      <Form form={form} layout='vertical'>
        <Flex justify='center' align='start' gap={20}>
          {/* <Flex className='relative h-[200px] w-[200px]'>
            <ImgCrop rotationSlider>
              <Upload name='avatar' className='h-[200px] w-[200px]' {...uploadProps}>
                <Avatar className='h-full w-full rounded-3xl' src={imageUrl ? imageUrl : currentUser.user.avatar} />
                <Flex
                  className='absolute bottom-0 left-0 right-0 top-0 z-10 cursor-pointer rounded-3xl bg-slate-500 bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100'
                  justify='center'
                  vertical
                  align='center'
                  gap={4}
                >
                  <Camera className='text-white' size={32} />
                  <Typography.Text className='text-center font-medium text-white'>
                    Click to change <br /> photo
                  </Typography.Text>
                </Flex>
              </Upload>
            </ImgCrop>
          </Flex> */}
          <Flex vertical className='w-full'>
            <Typography.Title className='m-0' level={2}>
              Account Details
            </Typography.Title>
            <Flex vertical className='w-full'>
              <Form.Item label='Full name' required name='fullNameProfile' initialValue={currentUser.user.fullName}>
                <Input placeholder='Nguyen Van A' required className='w-full' name='fullName' />
              </Form.Item>
              <Form.Item label='Phone' name='phoneProfile' required initialValue={currentUser.user.phone}>
                <InputNumber placeholder='123456789' required name='phone' className='w-full' />
              </Form.Item>
              <Form.Item
                label='Birthday'
                name='birthdayProfile'
                initialValue={currentUser.user.birthday ? dayjs(currentUser.user.birthday) : undefined}
              >
                <DatePicker className='w-full' name='birthday' format={'DD/MM/YYYY'} />
              </Form.Item>
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  )
}

export default ProfileDialog
