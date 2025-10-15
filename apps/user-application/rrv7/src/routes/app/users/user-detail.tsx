import { useLoaderData } from 'react-router';

import type { loadUserById } from '@/services/loaders';

export default function UserDetail() {
  const user = useLoaderData<typeof loadUserById>();

  return (
    <div className="bg-gray-100 rounded-md p-4">
      <h2>Name: {user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Bio: {user.bio}</p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta saepe
        deserunt, impedit, similique ea labore aut harum repellendus quasi sed
        aspernatur quia sequi facilis suscipit quod, in delectus dolore corporis
        pariatur accusamus voluptatem. Vel nihil nostrum quo dicta deleniti
        assumenda quae commodi vero mollitia minus aperiam optio aliquam debitis
        voluptas laboriosam, quaerat neque maiores ab excepturi pariatur.
        Accusamus cum earum quo, error ullam excepturi dolorem quod odit aperiam
        totam deserunt nisi magni quos! Iusto recusandae, tempora assumenda iste
        dolor architecto commodi sit dolorum voluptatem quia officiis nostrum
        cum ex, quisquam modi tempore ipsum harum? Tempora, optio atque labore
        ut, similique exercitationem at dolorum neque natus quam recusandae
        perspiciatis veritatis ex impedit ipsam sunt blanditiis inventore? Magni
        obcaecati atque eos praesentium autem nihil illum eveniet quo, omnis
        recusandae quaerat excepturi assumenda. Aspernatur, ducimus, modi rerum
        sed quasi quo eligendi culpa rem neque error facere quis expedita qui ea
        laudantium tenetur consequatur non. Nemo itaque enim mollitia a debitis
        sapiente numquam explicabo, vero ipsam minus qui exercitationem
        quibusdam voluptatum aut veritatis, alias perferendis consequatur
        ducimus fuga molestiae animi totam! Dolorem asperiores necessitatibus
        perferendis harum inventore quibusdam totam, aliquid commodi minus sint
        excepturi iste ad eos ratione quos provident impedit debitis magnam
        soluta! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit
        perferendis animi nemo dolores debitis dignissimos, maxime veritatis qui
        nesciunt quos praesentium ipsam? Distinctio hic omnis asperiores
        exercitationem natus quis ipsum corrupti, adipisci quo in praesentium
        cumque ut libero incidunt sunt. Esse laborum ad vitae voluptate natus
        qui amet, saepe alias! Excepturi cumque minus quod sit maiores
        perferendis optio, cum reprehenderit velit dolore molestiae fugiat
        impedit? Dolor asperiores quasi quis esse aut! Voluptatibus perspiciatis
        autem ipsa quo nostrum neque nulla tempore magnam vitae? Illum
        necessitatibus unde soluta, at quia omnis, quasi libero, nulla
        recusandae modi temporibus a laborum asperiores numquam explicabo
        debitis labore ipsum vero natus aliquam voluptatibus error placeat?
        Numquam neque dolores voluptatibus aliquid quo! Ex ipsum dolores nobis
        autem accusamus esse, quod aliquam cum, non saepe eum, assumenda aliquid
        suscipit quidem? Dolorem neque cupiditate, tenetur illo optio possimus
        exercitationem, recusandae officia sint vitae architecto temporibus. Sed
        qui nam voluptas, placeat dolorem perferendis, pariatur laudantium aut
        cum dolor non asperiores laborum, culpa autem esse vitae perspiciatis
        iste ipsam quo optio atque? A alias eaque ab itaque in velit corporis
        quae libero, hic, harum eos obcaecati assumenda at doloremque? Dolor,
        libero asperiores voluptatum quis officia quibusdam, veritatis ea fugit
        quisquam quos sit dignissimos, a cumque facilis ratione sunt quia alias
        reprehenderit autem modi enim fugiat dolore. Enim, impedit quod nesciunt
        commodi, ducimus nemo qui culpa distinctio quo cumque fuga, neque
        aliquid omnis perferendis quis expedita voluptatem quasi consequatur
        voluptatibus laudantium nisi hic aspernatur corrupti totam! Cumque in
        veniam illo voluptates obcaecati?
      </p>
    </div>
  );
}
