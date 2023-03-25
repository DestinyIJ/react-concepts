import React, { useRef, useCallback } from 'react'
import './styles.css'

const cards = [1,2,3,4,5,6,7,8,9,10]

const IntersectionObserverComponent = () => {

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('show', entry.isIntersecting)
      if(entry.isIntersecting) {
        
        entry.target.scrollIntoView( { behavior: 'auto'})
      }
    });
  }, {
    threshold: 0
  })

  const observeElement = (node:any) => {
    observer.observe(node)
  }
  
  const loadNewCards = (containerNode:any) => {
    for (let i = 0; i < 10; i++) {
      const card = document.createElement('div')
      card.textContent = 'New Card'
      card.classList.add('card')
      observer.observe(card)
      containerNode.append(card)
    }
  }
  const lastChildObserver = new IntersectionObserver(entries => {
    const lastChild = entries[0]
    if(!lastChild.isIntersecting) return
    loadNewCards(entries[0].target.parentNode)
    lastChildObserver.unobserve(lastChild.target)
    cardContainer(lastChild.target.parentNode)
  })

  const cardContainer = (node:any) => {
    lastChildObserver.observe(node.lastChild)
  }
  
  


  return (
    <div className='card-container' ref={cardContainer}  >
      <div className='card show'>This is the first card</div>
      {
        cards.map((card) => (
          <div ref={observeElement} key={card} className='card'>This is a card</div> 
        ))
      }
    </div>
  )
}

export default IntersectionObserverComponent