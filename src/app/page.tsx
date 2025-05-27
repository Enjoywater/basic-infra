import _ from 'lodash'
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import 'dayjs/locale/fr';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/es';

dayjs.locale('ko');

export default function Home() {
  const data = _.range(1).map(() => _.shuffle(Array(_.random(1, 100)).fill(' ')));

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="mb-2 tracking-[-.01em]">
          last deploy at {process.env.NEXT_PUBLIC_DEPLOY_TIME}
        </div>
        <div className="mb-2 tracking-[-.01em]">
          {data}
        </div>

        <canvas id="chart"></canvas>
      </main>
    </div>
  );
}
