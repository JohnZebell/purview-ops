import Link from 'next/link'
import { CTA_HREF, CTA_LABEL } from '../cta'
import { pageMetadata } from '../seo'

/* Every file that says what this page covers. Change what the page holds
   and these go stale.

   - The meta description below, and the comment above `sequence`
   - docs/purview_timing_page_copy.md
   - docs/purview_assistant_knowledge_base.md, section 11 and section 8
   - docs/purview_assistant_spec.md, the linking rule and the never do rule
   - docs/purview_site_restructure.md, section 4 and what this does not
     change */

export const metadata = pageMetadata({
  title: 'Timing',
  description:
    'How institutional and utility purchases form in public before anyone issues an RFP, and what it costs to respond to one and to know who is deciding.',
  path: '/timing',
})

/* Ordered by how early the step fires, not by how useful it is. The last row
   is the argument: everything above it happens before the thing most vendors
   wait for.

   `where` names a category of source rather than a service, so the table
   still only says where the record lives. The page around it no longer does.
   The response and the committee describe work performed, and they sit next
   to the sections they belong with rather than grouped together, so the two
   kinds of claim interleave. The response answers the last row of the table.
   The committee pairs with Pipeline, which is the other section about what a
   CRM fails to record. */
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

      {/* 2. THE RESPONSE */}
      <section>
        <div className="shell row">
          <h2 className="label">The response</h2>
          <div>
            <h3 className="label subLabel">What the constraint is</h3>
            <p>
              The table above ends where most timing advice ends, which is that
              a posted RFP is too late to influence. That is true for shaping
              the requirement and false for everything after it.
            </p>
            <p>
              The response still has to be written. It gets written whether the
              relationship is warm or cold, whether you helped shape the spec or
              saw it the day it posted, and whether you expect to win. So the
              cost of responding is not a marketing expense. It is the ceiling
              on how much of your market you can pursue at all.
            </p>
            <p>
              Teams selling into institutions usually discover this the same
              way. A handful of people spend weeks on documents that run to a
              hundred pages, most of it assembled by hand from previous
              submissions nobody organized, and the number of bids per cycle
              stops being a strategic choice and starts being whatever the team
              could physically produce.
            </p>
            <h3 className="label subLabel">What is already there</h3>
            <p>
              There is already a structure in those documents. Thirty past
              responses contain a repeated shape, a set of sections that get
              rewritten every time, and a set of fields that change per issuer.
              Nobody wrote it down because nobody had to.
            </p>
            <p>
              The work is reading what is already there and building the thing
              that reproduces it. Not a template someone else designed, and not
              advice about how the responses should be written differently. The
              people who have written a hundred of these know their market
              better than any outside read of it.
            </p>
            <h3 className="label subLabel">What it changes</h3>
            <p>
              What that changes is hours per response and responses per cycle.
              It does not change win rate, and anyone claiming otherwise in the
              first quarter is guessing, because the output is the same document
              made a different way.
            </p>
            <p>
              The win rate question becomes answerable later, and only because
              of this. Once responses share a structure, sections are comparable
              across submissions, and it is possible to ask which ones show up
              in the wins. That question cannot be asked of thirty documents
              written from scratch, because nothing in them lines up.
            </p>
          </div>
        </div>
      </section>

      {/* 3. COMBINATION */}
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

      {/* 4. PIPELINE */}
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

      {/* 5. THE COMMITTEE */}
      <section>
        <div className="shell row">
          <h2 className="label">The committee</h2>
          <div>
            <p>
              An institutional purchase is decided by a group. Procurement runs
              the process, engineering writes the requirement, operations lives
              with the result, and finance signs. Sometimes a regulatory or
              board step sits on top of all of it.
            </p>
            <p>
              A CRM records one contact per opportunity unless someone makes it
              do otherwise. So the deal that took four people to approve appears
              in the system as one name.
            </p>
            <p>
              That looks tidy and it hides two things. Nobody can see who has
              not been engaged yet, so the gap in the map is invisible until
              the deal stalls for a reason nobody can name. And the whole
              opportunity rests on one relationship, which means it is one job
              change away from having no anchor inside the account.
            </p>
            <p>
              An open opportunity with a single attached contact, in a market
              that buys by committee, is not a simple deal. It is one nobody has
              mapped.
            </p>
            <p>
              What gets recorded is roles rather than names. Who signs, who
              writes the requirement, who can stop it, and who has to live with
              it afterward. Those are questions a rep can answer from a call.
              They are not something to infer from titles, because an org chart
              assembled from the outside is a guess, and a guess in this field
              is worse than an empty one.
            </p>
          </div>
        </div>
      </section>

      {/* 6. LIMITS */}
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
              quarter. Response throughput is the exception, because hours per
              response and responses per cycle move inside one.
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
              identical in most CRMs. The audit computes your real cycle length,
              and reports whether anything in your system tells those two apart.
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
