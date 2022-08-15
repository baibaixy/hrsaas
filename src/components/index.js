import pageTools from './pageTools'
import UploadExcel from './UploadExcel'
import Uploading from './Uploading'
const components = [pageTools, UploadExcel, Uploading]
export default {
  install(Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component)
    })
  }
}
