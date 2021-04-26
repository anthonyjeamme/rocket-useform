import {
	TFormDataNode,
	TFormNodePath,
	TFormParams,
	TFormTools
} from '../../useForm.types'

export type TGetterProps = {
	formDataRef: React.MutableRefObject<TFormDataNode>
	path: TFormNodePath
	formTools: TFormTools
	formParams: TFormParams
}
