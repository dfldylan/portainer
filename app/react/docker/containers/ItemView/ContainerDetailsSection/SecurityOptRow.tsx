import { DetailsTable } from '@@/DetailsTable';

interface SecurityOptRowProps {
  securityOpts?: Array<string>;
}

export function SecurityOptRow({ securityOpts }: SecurityOptRowProps) {
  if (!securityOpts || securityOpts.length === 0) {
    return null;
  }

  return (
    <DetailsTable.Row label="SecurityOpt">
      <table className="table table-bordered table-condensed !m-0">
        <tbody>
          {Object.entries(securityOpts).map(([key, value]) => (
            <tr key={key}>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DetailsTable.Row>
  );
}
