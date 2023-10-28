import { Slot, component$ } from '@builder.io/qwik'

import './modal.css'

interface IModalProps {
  title?: string
  confirmButton?: string
  isOpen: boolean
  onClose: () => void
}

export const Modal = component$( ( { title = 'Modal', confirmButton = 'Ok', isOpen, onClose } : IModalProps ) => {

  return (
    <div class="modal" style={ { display: isOpen ? 'flex' : 'none' } }>
      <div class="modal-backdrop"></div>
      <article class="modal-content">
        <button
          class="modal-close"
          onClick$={ onClose }
        >
          <img class="modal-close-icon" src="/icons/x.icon.svg" alt="Close" />
        </button>
        <section class="modal-header">
          <h1 class="modal-title"> { title } </h1>
        </section>
        <section class="modal-body">
          <Slot />
        </section>
        <section class="modal-footer">
          <button
            class="modal-confirm"
            onClick$={ onClose }
          > { confirmButton } </button>
        </section>
      </article>
    </div>
  )
} )
