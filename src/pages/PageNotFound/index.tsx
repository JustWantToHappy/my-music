const PageNotFound = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img src={require('../../assets/img/404.png')} alt="图片无法显示" />
    </div>
  )
}
export default PageNotFound
