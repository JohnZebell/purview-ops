import Link from 'next/link'
import { CTA_HREF, CTA_LABEL } from '../cta'
import { pageMetadata } from '../seo'

export const metadata = pageMetadata({
  title: 'Timing',
  description:
    'How institutional and utility purchases actually form, in order, and where each step appears in the public record before anyone issues an RFP.',
  path: '/timing',
})

/* Ordered by how early the step fires, not by how useful it is. The last row
   is the argument: everything above it happens before the thing most vendors
   wait for.

   `where` names a category of source rather than a service on purpose. This
   page describes where the record lives. It does not claim anyone is reading
   it on your behalf. */
const sequence = [
  {
    event: 'A master plan names a facility and a year',
    where: 'Published on their own site',
    lead: '2 to 5 years',
  },
  {
    event: 'A climate or energy commitment is adopted with a date',
    where: 'Board resolution, published plan',
    lead: '1 to 10 years',
  },
  {
    event: 'A bond measure passes',
    where: 'County election results, EMMA',
    lead: '6 to 24 months',
  },
  {
    event: 'A capital plan includes an energy or facilities line',
    where: 'Budget document',
    lead: '6 to 18 months',
  },
  {
    event: 'An incentive or grant award is announced',
    where: 'State energy office, DOE, DSIRE',
    lead: '3 to 12 months',
  },
  {
    event: 'A board approves a study or engages a consultant',
    where: 'Board minutes',
    lead: '6 to 12 months',
  },
  {
    event: 'A permit is filed',
    where: 'County or city database',
    lead: '3 to 12 months',
  },
  {
    event: 'A facilities or sustainability director is hired',
    where: 'Job posting',
    lead: 'Immediate',
  },
  {
    event: 'An RFP posts',
    where: 'Procurement portal',
    lead: 'Too late',
  },
]

export default function Timing() {
  return (
    <main>
      {/* OPENING */}
      <section>
        <div className="shell row">
          <div className="label">Timing</div>
          <div>
            <h1 className="introTitle">Your buyers decide in public</h1>
            <p>
              When a utility, a school district, or a county decides to spend
              money, that decision happens in a meeting with minutes, in a
              budget document with line items, and often on a ballot. The
              record is public and most of it is published long before anyone
              issues an RFP.
            </p>
            <p>Almost nobody in your industry reads it.</p>
          </div>
        </div>
      </section>

      {/* 1. THE SEQUENCE */}
      <section>
        <div className="shell row">
          <h2 className="label">The sequence</h2>
          <div>
            <p>
              How an institutional purchase actually forms, in order. Each step
              with what fires, where it appears, and how far ahead of the
              purchase it is.
            </p>

            {/* Roles are written out because the mobile layout sets these
                elements to display:block, which drops the implicit table
                semantics. Above 48rem they match what the elements already
                are, so they cost nothing. See .seq in globals.css. */}
            <table className="seq" role="table">
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader" scope="col">
                    What happens
                  </th>
                  <th role="columnheader" scope="col">
                    Where it shows up
                  </th>
                  <th role="columnheader" scope="col">
                    Lead time
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {sequence.map((row) => (
                  <tr role="row" key={row.event}>
                    <th role="rowheader" scope="row">
                      {row.event}
                    </th>
                    <td role="cell" data-label="Where it shows up">
                      {row.where}
                    </td>
                    <td role="cell" data-label="Lead time">
                      {row.lead}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>
              <strong>That last row is the point.</strong> By the time a
              solicitation is public, the specification usually reflects a
              conversation that already happened.
            </p>
          </div>
        </div>
      </section>

      {/* 2. COMBINATION */}
      <section>
        <div className="shell row">
          <h2 className="label">Combination</h2>
          <div>
            <p>
              A budget line means money exists. A permit means construction is
              committed. Neither alone tells you the window is open.
            </p>
            <p>
              What does is a combination. Funding approved, plus movement
              toward procurement, plus nobody having posted anything yet. A
              board directing staff to bring options back is the strongest
              single signal, because it means the decision is live and the
              field is open.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PIPELINE */}
      <section>
        <div className="shell row">
          <h2 className="label">Pipeline</h2>
          <div>
            <p>
              The point is not a lead list. It is what it does to the numbers
              underneath.
            </p>
            <p>
              Deals waiting on an external clock look identical to deals that
              stalled. If a CRM cannot distinguish them, cycle length is wrong,
              forecast is wrong, and a rep deprioritizes an account two months
              before it was going to move.
            </p>
            <p>
              The fix is a field. Deals tagged with an external timeline get
              benchmarked separately from deals moving at their own pace. That
              is instrumentation, and it is the same work as everything else on{' '}
              <Link href="/method">the method page</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LIMITS */}
      <section>
        <div className="shell row">
          <h2 className="label">Limits</h2>
          <div>
            <p>
              Coverage is uneven. A dense metro&apos;s school districts publish
              everything. A rural water authority posts a scanned agenda once a
              quarter.
            </p>
            <p>
              Knowing a district has money does not mean they take the call.
              The signal makes outreach relevant. It does not make it welcome.
            </p>
            <p>
              And the lead times are long. A signal firing today may not become
              a purchase for a year, which means it cannot be judged on a
              quarter.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <section className="tight">
        <div className="shell row">
          <div className="label">Next</div>
          <div>
            <h2 className="closeTitle">Two weeks against your own data</h2>
            <p className="closeSub">
              Deals waiting on an external clock and deals that stalled look
              identical in most CRMs. Telling them apart is one of the checks.
              $1,000, credited against your first month if you keep going. The
              findings are yours either way.
            </p>
            <div className="cta">
              <Link className="btn big" href={CTA_HREF}>
                {CTA_LABEL}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
