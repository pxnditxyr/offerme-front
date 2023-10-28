import { $, useComputed$, useSignal } from '@builder.io/qwik'

export const  useModalStatus = ( initialValue : boolean = false ) => {
  const modalStatus = useSignal<boolean>( initialValue )

  const onCloseModal = $( () => {
    modalStatus.value = false
  } )

  const onOpenModal = $( () => {
    modalStatus.value = true
  } )

  return {
    modalStatus: useComputed$( () => modalStatus.value ),
    onOpenModal,
    onCloseModal,
  }
}
