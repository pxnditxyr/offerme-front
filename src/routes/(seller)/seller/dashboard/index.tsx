import { component$, useStyles$ } from '@builder.io/qwik'
import { DocumentHead } from '@builder.io/qwik-city'
import { LoadingPage } from '~/components/shared'
import { useAuthStore } from '~/hooks'

import styles from './dashboard.styles.css?inline'

export default component$( () => {

  useStyles$( styles )

  const { user, status } = useAuthStore()
  if ( status === 'loading' ) return ( <LoadingPage /> )

  return (
    <div class="dashboard__container">
      <h1 class="dashboard__title"> Dashboard </h1>
      <article class="dashboard__info">
        <p class="dashboard__subtitle"> Welcome { user?.peopleInfo.name } { user?.peopleInfo.paternalSurname } { user?.peopleInfo.maternalSurname } </p>
        <p class="dashboard__subtitle"> Role: { user?.role.name } </p>
        <p class="dashboard__subtitle"> Email: { user?.email } </p>
      </article>

      <div class="main flex-d flex-c">
        <div class="main-top flex-d">
          <h2> </h2>

          <div class="main-top-left flex">
            

            <div class="icon flex">
              <ion-icon name="notifications-outline"></ion-icon>
            </div>

            <div class="user flex">
              <img src={ `${ user?.mainAvatar || '/icons/user-avatar.svg' }` } alt="user"
                width="80" height="80"
              />
              <h4> { user?.peopleInfo.name } { user?.peopleInfo.paternalSurname } { user?.peopleInfo.maternalSurname } </h4>
            </div>
          </div>
        </div>
        <div class="main-bottom flex-d">
          <div class="main-bottom-left flex flex-c">
            <div class="graph">
              <img src="https://raw.githubusercontent.com/programmercloud/sales-dashboard/main/img/graph.png" alt="" />
              <a href="#" class="btn">See Details</a>
            </div>

            <div class="stats flex-d">
              <div class="top-selling">
                <div class="head flex-d">
                  <h2>Top selling product</h2>
                  <p>7 days</p>
                </div>

                <div class="flex-d">
                  <div class="details flex-d">
                    <div class="table">
                      <div class="row flex-d">
                        <h4>Name</h4>
                        <p>Iphone</p>
                      </div>

                      <div class="row flex-d">
                        <h4>Price</h4>
                        <p>$499</p>
                      </div>

                      <div class="row flex-d">
                        <h4>Sales</h4>
                        <p>27</p>
                      </div>
                    </div>
                  </div>
                  <div class="product">
                    <img src="https://raw.githubusercontent.com/programmercloud/sales-dashboard/main/img/laptop.png" alt="" />
                  </div>
                </div>
              </div>

              <div class="customers">
                <h2>Customer</h2>
                <div class="country flex">
                  <span class="blue"></span>
                  <h4>Europe</h4>
                  <p>79%</p>
                </div>

                <div class="country flex">
                  <span class="green"></span>
                  <h4>Asia</h4>
                  <p>52%</p>
                </div>
              </div>
            </div>
          </div>
          <div class="main-bottom-right flex-d flex-c">
            <div class="orders">
              <h2>Recent Orders</h2>
              <div class="order flex-d">
                <ion-icon class="icon-btn" name="logo-apple"></ion-icon>
                <p>Iphone</p>
                <p class="price">$499</p>
              </div>

              <div class="order flex-d">
                <ion-icon class="icon-btn" name="logo-google"></ion-icon>
                <p>G.Phone</p>
                <p class="price">$1249</p>
              </div>

              <div class="order flex-d">
                <ion-icon class="icon-btn" name="logo-microsoft"></ion-icon>
                <p>Laptop</p>
                <p class="price">$2399</p>
              </div>

              <div class="order flex-d">
                <ion-icon class="icon-btn" name="watch-outline"></ion-icon>
                <p>Watch</p>
                <p class="price">$500</p>
              </div>
            </div>

            <div class="plans flex flex-c">
              <h2>Weekly Plan</h2>
              <div class="progress-bar flex">49%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} )
export const head : DocumentHead = {
  title: 'Dashboard',
}
