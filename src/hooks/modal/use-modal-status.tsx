import { $, useSignal } from '@builder.io/qwik'

export const  useModalStatus = ( initialValue : boolean = false ) => {
  const modalStatus = useSignal<boolean>( initialValue )

  const onCloseModal = $( () => {
    modalStatus.value = false
  } )

  const onOpenModal = $( () => {
    modalStatus.value = true
  } )

  return {
    modalStatus,
    onOpenModal,
    onCloseModal,
  }
}
