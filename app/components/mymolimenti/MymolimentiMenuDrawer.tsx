import {Drawer} from '~/components/Drawer';
import {IconCaret} from '~/components/Icon';
import {Link} from '~/components/Link';
import {NAV_LINKS} from '~/components/mymolimenti/constants';

export function MymolimentiMenuDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <nav className="grid gap-1 p-6">
        {NAV_LINKS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={onClose}
            className="flex items-center justify-between border-b border-black/5 py-4 text-base font-medium text-black"
          >
            <span>{item.label}</span>
            <IconCaret direction="right" className="h-4 w-4" stroke="#444444" />
          </Link>
        ))}
      </nav>
    </Drawer>
  );
}
